import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// .envファイルの環境変数をロード
dotenv.config({
	path: '../../.env',
});

if (!process.env.POST_URL) {
	throw new Error('POST_URLの環境変数が設定されてません');
}

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/schema.ts',
	out: './drizzle',
	dbCredentials: {
		url: process.env.POST_URL,
	},
});
