import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	EntryPointCommandHandlerType,
	InteractionContextType,
	REST,
	Routes,
} from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config({
	path: resolve(dirname(fileURLToPath(import.meta.url)), '../../../.env'),
});

const token = process.env.BOT_TOKEN;
const applicationId = process.env.VITE_CLIENT_ID ?? '';

if (!token) {
	throw new Error('トークンが設定されてません');
}

const rest = new REST({ version: '10' }).setToken(token);

async function registerActivityCommand() {
	const application = (await rest.get(Routes.currentApplication())) as {
		id: string;
		name: string;
	};

	const command = await rest.post(Routes.applicationCommands(applicationId), {
		body: {
			name: '読み上げ開始',
			description: '読み上げアクティビティを起動します',
			type: ApplicationCommandType.PrimaryEntryPoint,
			handler: EntryPointCommandHandlerType.DiscordLaunchActivity,
			integration_types: [ApplicationIntegrationType.GuildInstall],
			contexts: [InteractionContextType.Guild],
		},
	});

	console.log(`${application.name} にアクティビティコマンドを登録しました。`);
	console.log(command);
}

registerActivityCommand().catch((error: unknown) => {
	console.error('アクティビティコマンドの登録に失敗しました。');
	console.error(error);
	process.exitCode = 1;
});
