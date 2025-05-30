import type { CommandResponse } from '@discord/embedded-app-sdk';

export interface wavData {
	userId: string;
	wavData: string;
}

export interface memberVoiceWebSocketData {
	wavDatas: wavData[];
	memberIds: string[];
	message: string;
	author_name: string;
	author_avatar_url: string;
	author_id: string;
	channel_id: string;
}

export interface WebScoketData extends memberVoiceWebSocketData {
	isSetClientId?: string;
	clientId?: string;
}
export type TAuthenticatedContext = CommandResponse<'authenticate'> & {
	guildMember: IGuildsMembersRead | null;
};

export interface IGuildsMembersRead {
	roles: string[];
	nick: string | null;
	avatar: string | null;
	premium_since: string | null;
	joined_at: string;
	is_pending: boolean;
	pending: boolean;
	communication_disabled_until: string | null;
	user: {
		id: string;
		username: string;
		avatar: string | null;
		discriminator: string;
		public_flags: number;
	};
	mute: boolean;
	deaf: boolean;
}
