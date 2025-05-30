import { z } from 'zod';
import { ttsDataSchema, ttsDataViewSchema } from './tts';

/**ユーザ情報スキーマ */
const userInfoSchema = z.object({
	memberDisplayName: z.string(),
	memberAvatarUrl: z.string().url(),
});

/**ユーザ情報&読み上げ情報スキーマ */
export const userDataWithTtsSchema = z.object({
	ttsData: ttsDataSchema,
	userInfo: userInfoSchema,
});

/*** ユーザ情報&読み上げ情報画面スキーマ*/
export const userDataWithTtsViewSchema = z.object({
	ttsData: ttsDataViewSchema,
	userInfo: userInfoSchema,
});
