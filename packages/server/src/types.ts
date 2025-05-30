export interface IGetOAuthToken {
	access_token: string;
}

export type Env = {
	VOICE_TEXT_WEB_API: string;
	BASE_URL: string;
};

export interface MessageType {
	message: string;
	author_name: string;
	memberIds: string[];
	author_avatar_url: string;
	author_id: string;
	channel_id: string;
}

export interface UsersType {
	parentId: string;
	userIds: string[];
}
