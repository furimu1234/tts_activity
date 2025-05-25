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
	type UserDataSchema,
	patchTtsSettingsInputSchema,
	ttsSettingsInputSchema,
	ttsTransformMessageInputSchema,
} from '@tts/serverschema/src/schemaTypes';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { logger } from 'hono/logger';
import { dataStoreContainer } from '../container';
import type { Env } from '../types';
import { makeVoiceBinFromMessage } from '../utils/tts';
import { registerMembers } from '../utils/ttsSetting';
import { websocket } from '../websocket';

const app = new Hono<{
	Bindings: Env;
}>();
app.use('*', logger());
app.onError((err, c) => {
	console.error('❌ onError:', err);
	return c.json({ message: err.message }, 500);
});

dataStoreContainer;
app.post(
	'/transform-message',
	zValidator('json', ttsTransformMessageInputSchema, (result, c) => {
		console.log(result);
	}),
	async (c) => {
		const { VOICE_TEXT_WEB_API, BASE_URL } = env(c);

		const body = await c.req.valid('json');

		const store = dataStoreContainer.getDataStore(c);
		const voiceBinary = await store.do(async (db) => {
			const voiceBinary = await makeVoiceBinFromMessage(
				db,
				body,
				VOICE_TEXT_WEB_API,
				BASE_URL,
			);

			if (!voiceBinary) {
				throw new Error('voiceBinaryが見つかりませんでした');
			}
			return voiceBinary;
		});

		const voiceBase64 = Buffer.from(voiceBinary).toString('base64');

		body.wavData = voiceBase64;

		const channelId = body.channel_id;
		for (const clientId in websocket.clients) {
			if (websocket.clients[clientId].channelId !== channelId) continue;
			const client = websocket.clients[clientId].client;
			client.send(JSON.stringify(body));
		}
		return c.json({ message: 'OK' }, 201);
	},
);

app.post(
	'/getVoiceSetting',
	zValidator('json', ttsSettingsInputSchema, async (result, c) => {
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
			const subDatas: UserDataSchema[] = [];

			let mainUserVoiceSetting = await getVoiceSetting(db, mainUserId);

			if (!mainUserVoiceSetting) {
				mainUserVoiceSetting = await createVoiceSetting(db, mainUserId);
			}

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

			const memberInfo =
				voiceChannelMembers.memberInfos[mainUserVoiceSetting.userId];

			const mainUserData = {
				ttsData: mainUserVoiceSetting,
				userInfo: memberInfo,
			} satisfies UserDataSchema;

			for (const memberId of Object.keys(voiceChannelMembers.memberInfos)) {
				if (memberId === mainUserId) continue;

				let subVoiceSetting = await getVoiceSubSetting(
					db,
					mainUserId,
					memberId,
				);

				if (!subVoiceSetting) {
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

				const memberInfo = voiceChannelMembers.memberInfos[memberId];

				const subUserData = {
					ttsData: subVoiceSetting,
					userInfo: memberInfo,
				} satisfies UserDataSchema;
				subDatas.push(subUserData);
			}

			return { mainData: mainUserData, subDatas };
		});

		return c.json(voiceSettings, 200);
	},
);

export default app;
app.patch(
	'/patch_voice_setting',
	zValidator('json', patchTtsSettingsInputSchema, async (result, c) => {
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
