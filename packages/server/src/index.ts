import { type UUID, randomUUID } from 'node:crypto';
import { serve } from '@hono/node-server';
import { createNodeWebSocket } from '@hono/node-ws';
import * as dotenv from 'dotenv';
import { Hono } from 'hono';
import api from './routes/api';
import { websocket } from './websocket';

// .envファイルを読み込む
dotenv.config({ path: '../../.env' });

const app = new Hono();
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.route('/api', api);

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

app.get(
	'/api/ws',
	upgradeWebSocket((c) => ({
		onOpen: (event, ws) => {
			const clientId: UUID = randomUUID();
			websocket.clients[clientId] = { client: ws, channelId: '' };
			ws.send(JSON.stringify({ isSetClientId: true, clientId: clientId }));
		},
		onMessage: (event, ws) => {
			const data = JSON.parse(event.data.toString());
			const client = websocket.clients[data.clientId].client;
			websocket.clients[data.clientId] = {
				channelId: data.channelId,
				client: client,
			};
		},
	})),
);

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
