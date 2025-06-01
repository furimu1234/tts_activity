import { ChannelType, Client, Events, GatewayIntentBits } from 'discord.js';

import { serve } from '@hono/node-server';
import {
	createUserInfo,
	createVoiceChannelMembers,
	getUserInfo,
	getVoiceChannelMembers,
	updateVoiceChannelMembers,
} from '@tts/db';
import {
	type TtsTransformMessageRequestSchema,
	ttsTransformMessageBodySchema,
} from '@tts/serverschema';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { dataStoreContainer } from './container';
import { ENV, type Env } from './env';
import { memberArrayTomemberInfo } from './utils/convert';
import { customLogger } from './utils/error';

const app = new Hono<{
	Bindings: Env;
}>();
app.use('*', logger(customLogger));

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.on(Events.Error, async (error) => {
	console.error(error);
});

app.get('/check', async (c) => {
	const { channelId } = c.req.query();

	const channel = client.channels.cache.get(channelId);
	//チャンネルタイプがステージかボイス以外はエラー
	if (!channel)
		throw new HTTPException(404, {
			message: '不明なチャンネルを検知しました。再起動してみてください。',
		});

	if (channel.type !== ChannelType.GuildVoice)
		throw new HTTPException(500, {
			message: 'ボイスチャンネルのみで実行できます。',
		});

	const channelMembers = Array.from(channel.members.values());

	if (channelMembers.length === 0) {
		throw new HTTPException(404, {
			message: '(自分含め)メンバーがいるVCで実行できます。',
		});
	}

	const store = dataStoreContainer.getDataStore();

	await store.do(async (db) => {
		await Promise.all(
			channelMembers.map(async (x) => {
				const userInfo = await getUserInfo(db, x.id);
				console.log("getUserInfo: ", x.displayName)

				if (!userInfo) {
					console.warn("createUserInfo: ", x.displayName)
					await createUserInfo(db, x.id, x.displayAvatarURL(), x.displayName);
				}
			}),
		);
	})

	


	return c.json({ message: 'OK' }, 200);
});

app.get('/register_members', async (c) => {
	const { channelId } = c.req.query();

	const channel = client.channels.cache.get(channelId);
	//チャンネルタイプがステージかボイス以外はエラー
	if (!channel)
		throw new HTTPException(401, { message: 'Custom error message' });

	if (channel.type !== ChannelType.GuildVoice)
		return c.json({ message: 'ボイスチャンネル以外では使用できません。' }, 500);

	const store = dataStoreContainer.getDataStore();
	const channelMembers = Array.from(channel.members.values());

	if (channelMembers.length === 0) {
		throw new HTTPException(401, { message: 'Custom error message' });
	}

	await store.do(async (db) => {
		let channelDBData = await getVoiceChannelMembers(db, channelId);

		if (!channelDBData) {
			channelDBData = await createVoiceChannelMembers(db, channelId);
		}
		channelDBData.memberInfos = memberArrayTomemberInfo(channelMembers);

		await Promise.all(
			channelMembers.map(async (x) => {
				const userInfo = await getUserInfo(db, x.id);

				if (!userInfo) {
					await createUserInfo(db, x.id, x.displayAvatarURL(), x.displayName);
				}
			}),
		);

		await updateVoiceChannelMembers(db, channelDBData);
	});

	return c.json({ message: 'OK' }, 200);
});

client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return;

	//設定作るまではインチャのみ有効
	if (message.channel.type !== ChannelType.GuildVoice) return;
	const voiceChannelMembers = message.channel.members;

	//VCに入ってるユーザ以外のボイスは読まない
	//TODO: vcjoinのフラグを作成して対応するかも
	if (!voiceChannelMembers.get(message.author.id)) return;

	const data = {
		author_avatar_url: message.author.displayAvatarURL(),
		author_id: message.author.id,
		author_name: message.author.displayName,
		channel_id: message.channelId,
		message: message.content,
		memberIds: voiceChannelMembers.map((x) => x.id),
		wavDatas: [],
	} satisfies TtsTransformMessageRequestSchema;

	const parsed = ttsTransformMessageBodySchema.safeParse(data);

	if (parsed.error) return;

	fetch(`https://${ENV.DOMAIN}/api/transform-message`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(parsed.data),
	});
});

client.login(ENV.TOKEN);
serve(
	{
		fetch: app.fetch,
		port: 9000,
		hostname: '0.0.0.0',
		serverOptions: {},
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
