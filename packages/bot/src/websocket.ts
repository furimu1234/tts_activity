import type { WSContext } from 'hono/ws';

export const websocket: {
	clients: {
		[key: string]: { channelId: string; client: WSContext<WSContext> };
	};
} = {
	clients: {},
};
