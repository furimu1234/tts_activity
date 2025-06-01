import { zValidator } from '@hono/zod-validator';
import {
	createSubVoiceSetting,
	createVoiceSetting,
	getVoiceChannelMembers,
	getVoiceSetting,
	getVoiceSubSetting,
	updateSubVoiceSetting,
	updateVoiceSetting,
} from '@tts/db';
import {
	type UserDataWithTtsResponseSchema,
	type WavDataWithUserIdResponseSchema,
	getTtsSettingsBodySchema,
	patchTtsSettingsBodySchema,
	ttsTransformMessageBodySchema,
} from '@tts/serverschema';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { dataStoreContainer } from '../container';
import type { Env } from '../types';
import { makeVoiceBinFromMessage } from '../utils/tts';
import { registerMembers } from '../utils/ttsSetting';
import { websocket } from '../websocket';

const app = new Hono<{
	Bindings: Env;
}>();
app.onError((err, c) => {
	console.error('❌ onError:', err);
	return c.json({ message: err.message }, 500);
});

/**読み上げメッセージ転送
 * channelIdにいるメンバーのメッセージ送信者の読み上げ設定を取得してwebsocketで画面に送信
 *
 */
app.post(
	'/transform-message',
	zValidator('json', ttsTransformMessageBodySchema, (result, c) => {}),
	async (c) => {
		const { VOICE_TEXT_WEB_API, BASE_URL } = env(c);

		const body = await c.req.valid('json');

		const store = dataStoreContainer.getDataStore(c);
		const voiceDatas = await store.do(async (db) => {
			const voiceData = await makeVoiceBinFromMessage(
				db,
				body,
				VOICE_TEXT_WEB_API,
				BASE_URL,
			);

			if (!voiceData) {
				throw new Error('voiceBinaryが見つかりませんでした');
			}
			return voiceData;
		});

		body.wavDatas = voiceDatas
			.map((x) => {
				if (!x.voiceData) return;
				if (!x.voiceData.byteArray) return;

				return {
					wavData: Buffer.from(x.voiceData.byteArray).toString('base64'),
					userId: x.userId,
				} satisfies WavDataWithUserIdResponseSchema;
			})
			.filter((x) => !!x);

		const channelId = body.channel_id;

		console.log(body)

		for (const clientId in websocket.clients) {
			if (websocket.clients[clientId].channelId !== channelId) continue;
			const client = websocket.clients[clientId].client;
			client.send(JSON.stringify(body));
		}
		return c.json({ message: 'OK' }, 201);
	},
);

/**読み上げ設定取得
 * 設定画面を開いた人の読み上げ設定と同じVCにいる人の設定を取得
 */
app.post(
	'/getVoiceSetting',
	zValidator('json', getTtsSettingsBodySchema, async (result, c) => {
		if (!result.success) {
			console.error('failed zod parse: ', result.error.issues);
		}
	}),
	async (c) => {
		const body = await c.req.valid('json');
		const mainUserId = body.mainUserId;
		const channelId = body.channelId;

		const store = dataStoreContainer.getDataStore(c);
		const voiceSettings = await store.do(async (db) => {
			const subDatas: UserDataWithTtsResponseSchema[] = [];

			let mainUserVoiceSetting = await getVoiceSetting(db, mainUserId);

			if (!mainUserVoiceSetting) {
				mainUserVoiceSetting = await createVoiceSetting(db, mainUserId);
			}
			//一緒のVCに入ってるメンバーをDBに登録
			const errorMessage = await registerMembers(channelId);
			if (errorMessage !== undefined) {
				return c.json(
					{ message: errorMessage, mainData: undefined, subDatas: [] },
					500,
				);
			}

			const voiceChannelMembers = await getVoiceChannelMembers(db, channelId);
			if (!voiceChannelMembers) {
				return c.json(
					{
						message: 'ユーザがいるボイスチャンネルで実行できます。',
						mainData: undefined,
						subDatas: [],
					},
					500,
				);
			}

			//画面を開いてるユーザ情報を取得
			const memberInfo =
				voiceChannelMembers.memberInfos[mainUserVoiceSetting.userId];

			const mainUserData = {
				ttsData: mainUserVoiceSetting,
				userInfo: memberInfo,
			} satisfies UserDataWithTtsResponseSchema;

			//サブデータ取得
			for (const memberId of Object.keys(voiceChannelMembers.memberInfos)) {
				if (memberId === mainUserId) continue;

				let subVoiceSetting = await getVoiceSubSetting(
					db,
					mainUserId,
					memberId,
				);

				if (!subVoiceSetting) {
					//対象ユーザの読み上げ設定をサブデータにコピーする
					let userVoiceSetting = await getVoiceSetting(db, memberId);
					if (!userVoiceSetting) {
						userVoiceSetting = await createVoiceSetting(db, memberId);
					}

					if (userVoiceSetting) {
						subVoiceSetting = await createSubVoiceSetting(
							db,
							mainUserId,
							memberId,
							userVoiceSetting,
						);
					}
				}
				//ユーザの情報を取得
				const memberInfo = voiceChannelMembers.memberInfos[memberId];
				//サブデータ
				const subUserData = {
					ttsData: subVoiceSetting,
					userInfo: memberInfo,
				} satisfies UserDataWithTtsResponseSchema;
				subDatas.push(subUserData);
			}

			return { mainData: mainUserData, subDatas };
		});

		return c.json(voiceSettings, 200);
	},
);

/**
 * 読み上げ設定更新
 * 画面を開いた人の指定したユーザの読み上げ設定を更新する
 */
app.patch(
	'/patch_voice_setting',
	zValidator('json', patchTtsSettingsBodySchema, async (result, c) => {
		if (!result.success) {
			console.error('failed zod parse: ', result.error.issues);
		}
	}),
	async (c) => {
		const body = await c.req.valid('json');

		const store = dataStoreContainer.getDataStore(c);
		await store.do(async (db) => {
			if (body.mainUserId !== body.userId) {
				const voiceSetting = await getVoiceSubSetting(
					db,
					body.mainUserId,
					body.userId,
				);
				voiceSetting.speaker = body.speaker;
				voiceSetting.emotion = body.emotion;
				voiceSetting.emotionLevel = body.emotionLevel;
				voiceSetting.speed = body.speed;
				voiceSetting.pitch = body.pitch;
				voiceSetting.isSelfEdited = true;

				await updateSubVoiceSetting(
					db,
					body.mainUserId,
					body.userId,
					voiceSetting,
				);
			} else {
				const voiceSetting = await getVoiceSetting(db, body.mainUserId);
				if (!voiceSetting) {
					return c.json({ message: '読み上げ設定が見つかりませんでした' }, 404);
				}

				voiceSetting.speaker = body.speaker;
				voiceSetting.emotion = body.emotion;
				voiceSetting.emotionLevel = body.emotionLevel;
				voiceSetting.speed = body.speed;
				voiceSetting.pitch = body.pitch;

				await updateVoiceSetting(db, body.mainUserId, voiceSetting);
			}
		});

		return c.json({ message: 'OK' }, 200);
	},
);
export default app;
