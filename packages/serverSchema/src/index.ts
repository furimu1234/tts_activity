import type { emotion, speaker } from '@tts/db';

export * from './schemaTypes';
export * from './user';
export * from './tts';
export * from './dictionary';

type speakerToJpReacord = Record<speaker, string>;
type speakerToEnReacord = Record<string, speaker>;

export const speakerToJpRecord: speakerToJpReacord = {
	show: '男性1',
	takeru: '男性2',
	hikari: '女性1',
	haruka: '女性2',
	santa: 'サンタ',
	bear: '熊',
};

export const speakerToEnRecord: speakerToEnReacord = {
	男性1: 'show',
	男性2: 'takeru',
	女性1: 'hikari',
	女性2: 'haruka',
	サンタ: 'santa',
	熊: 'bear',
};

type emotionToJpReacord = Record<emotion, string>;
type emotionToEnReacord = Record<string, emotion>;

export const emotionToJpRecord: emotionToJpReacord = {
	happiness: '幸せ',
	anger: '怒り',
	sadness: '悲しみ',
};
export const emotionToEnRecord: emotionToEnReacord = {
	幸せ: 'happiness',
	怒り: 'anger',
	悲しみ: 'sadness',
};
