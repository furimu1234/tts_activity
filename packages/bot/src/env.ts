import * as dotenv from 'dotenv';

// .envファイルの環境変数をロード
dotenv.config({
	path: '../../.env',
	override: true,
});

function getEnvVariable(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Environment variable ${key} is missing`);
	}
	return value;
}

export const ENV = {
	TOKEN: getEnvVariable('BOT_TOKEN'),
	POST_URL: getEnvVariable('POST_URL'),
};

export type Env = typeof ENV;
