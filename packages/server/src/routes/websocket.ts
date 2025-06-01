import { Hono } from "hono";
import { Env } from "../types";
import { randomUUID, UUID } from "crypto";
import { websocket } from "../websocket";
import { upgradeWebSocket } from "../index";

const app = new Hono<{
    Bindings: Env;
}>();

app.get(
	'/ws',
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

export default app;
