import { z } from 'zod';

export const emotions = ['happiness', 'anger', 'sadness'] as const;

export const emotion = z.enum(emotions);
export type emotion = z.infer<typeof emotion>;

export const speakers = [
	'show',
	'haruka',
	'hikari',
	'takeru',
	'santa',
	'bear',
] as const;
export const speaker = z.enum(speakers);
export type speaker = z.infer<typeof speaker>;

export interface memberData {
	memberDisplayName: string;
	memberAvatarUrl: string;
}

export type memberInfo = { [key: string]: memberData };
