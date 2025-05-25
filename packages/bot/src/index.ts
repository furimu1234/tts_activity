import { ChannelType, Client, Events, GatewayIntentBits } from 'discord.js';

import { serve } from '@hono/node-server';
import {
	createVoiceChannelMembers,
	getVoiceChannelMembers,
	updateVoiceChannelMembers,
} from '@tts/db';
import {
	type TtsTransformMessageInputSchema,
	ttsTransformMessageInputSchema,
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

		await updateVoiceChannelMembers(db, channelDBData);
	});
	console.log('OK');

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
	} satisfies TtsTransformMessageInputSchema;

	const parsed = ttsTransformMessageInputSchema.safeParse(data);

	if (parsed.error) return;

	const store = dataStoreContainer.getDataStore();
	const channelMembers = Array.from(voiceChannelMembers.values());

	await store.do(async (db) => {
		let data = await getVoiceChannelMembers(db, message.channelId);

		if (!data) {
			data = await createVoiceChannelMembers(db, message.channelId);
		}

		data.memberInfos = memberArrayTomemberInfo(channelMembers);
		console.log(data);
		await updateVoiceChannelMembers(db, data);
	});

	fetch('http://localhost:8787/api/transform-message', {
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
