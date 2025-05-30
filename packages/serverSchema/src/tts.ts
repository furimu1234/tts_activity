import { emotion, speaker } from '@tts/db';
import { z } from 'zod';

/**音声データスキーマ
 * ユーザごとのメッセージ送信者のボイス
 */
export const ttsWavDataWithUserIdSchema = z.object({
	wavData: z.string().nullish(),
	userId: z.string().min(1).max(19),
});

/**音声転送スキーマ */
export const ttsTransformMessageBodySchema = z.object({
	message: z.string().max(19).min(1),
	author_name: z.string().min(1),
	author_id: z.string().max(19).min(1),
	memberIds: z.string().array(),
	channel_id: z.string().max(19).min(1),
	author_avatar_url: z.string().url({ message: 'URLを指定してください' }),
	wavDatas: ttsWavDataWithUserIdSchema.array(),
});

/**読み上げ設定取得body */
export const getTtsSettingsBodySchema = z.object({
	channelId: z.string().max(19).min(1),
	mainUserId: z.string().max(19).min(1),
});

/**読み上げ設定変更スキーマ */
export const patchTtsSettingsBodySchema = z.object({
	mainUserId: z.string().min(1).max(19),
	userId: z.string().min(1).max(19),
	speaker: speaker,
	emotion: emotion,
	emotionLevel: z.number().min(1).max(4),
	pitch: z.number().min(1).max(200),
	speed: z.number().min(1).max(400),
});

/**読み上げ設定スキーマ */
export const ttsDataSchema = z.object({
	id: z.number(),
	userId: z.string().min(1).max(19),
	speaker: speaker,
	emotion: emotion,
	emotionLevel: z.number().min(1).max(4),
	pitch: z.number().min(1).max(200),
	speed: z.number().min(1).max(400),
	createdAt: z.date().nullable(),
	updatedAt: z.date().nullable(),
});

/**読み上げ設定画面スキーマ */
export const ttsDataViewSchema = ttsDataSchema
	.omit({ createdAt: true, updatedAt: true })
	.extend({
		createdAt: z.string().nullable(),
		updatedAt: z.string().nullable(),
	});
