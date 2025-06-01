import { serve } from '@hono/node-server';
import { createNodeWebSocket } from '@hono/node-ws';
import * as dotenv from 'dotenv';
import { Hono, type MiddlewareHandler } from 'hono';
import api from './routes/api';

// .envファイルを読み込む
dotenv.config({ path: '../../.env' });

const hostFilter: MiddlewareHandler = async (c, next) => {
	const host = c.req.header('host') || '';
	if (![process.env.DOMAIN].includes(host)) {
		return c.text('Forbidden', 403);
	}
	await next();
};

const app = new Hono();
app.use('*', hostFilter);
export const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.route('/', api);

app.post('/api/token', async (c) => {
	// リクエストボディの取得
	const body = await c.req.json();

	// URLSearchParamsを使ってトークンリクエストのボディを構築
	const tokenBody = new URLSearchParams({
		client_id: process.env.VITE_CLIENT_ID!,
		client_secret: process.env.CLIENT_SECRET!,
		grant_type: 'authorization_code',
		code: body.code,
	});

	// Discord APIにPOSTリクエストを送る
	const response = await fetch(
		`${process.env.VITE_DISCORD_API_BASE}/oauth2/token`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: tokenBody,
		},
	);

	// レスポンスをJSONとして取得
	const data = await response.json();
	if (response.status !== 200) {
		console.error(data);

		return c.json(data, 500); // エラーレスポンスを返す
	}

	const { access_token } = data;

	// アクセストークンをJSONで返す
	return c.json(
		{ access_token },
		{ headers: { 'Access-Control-Allow-Origin': '*' } },
	);
});

app.get('/', (c) => {
	return c.text('Hello Hono!');
});


app.notFound((c) => {
	const path = c.req.url; // リクエストされたパスを取得
	console.log(`404 Not Found: ${path}`, 404);
	return c.text(`404 Not Found: ${path}`, 404);
});

const server = serve(
	{
		fetch: app.fetch,
		port: 8787,
		hostname: '0.0.0.0',
		serverOptions: {},
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);

injectWebSocket(server);
