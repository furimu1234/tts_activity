import type { WSContext } from 'hono/ws';
import type { WebSocket as WSWebSocket } from 'ws';

export const websocket: {
	clients: {
		[key: string]: { channelId: string; client: WSContext<WSWebSocket> };
	};
} = {
	clients: {},
};
