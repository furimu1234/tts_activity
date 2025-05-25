import { emotion, speaker } from '@tts/db';
import { z } from 'zod';

export const ttsTransformMessageInputSchema = z.object({
	message: z.string().max(19).min(1),
	author_name: z.string().min(1),
	author_id: z.string().max(19).min(1),
	channel_id: z.string().max(19).min(1),
	author_avatar_url: z.string().url({ message: 'URLを指定してください' }),
	wavData: z.string().nullish(),
});

export const patchTtsSettingsInputSchema = z.object({
	mainUserId: z.string().min(1).max(19),
	userId: z.string().min(1).max(19),
	speaker: speaker,
	emotion: emotion,
	emotionLevel: z.number().min(1).max(4),
	pitch: z.number().min(1).max(200),
	speed: z.number().min(1).max(400),
});

export const ttsSettingsInputSchema = z.object({
	channelId: z.string().max(19).min(1),
	mainUserId: z.string().max(19).min(1),
});

const ttsDataSchema = z.object({
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

const ttsDataViewSchema = z.object({
	id: z.number(),
	userId: z.string().min(1).max(19),
	speaker: speaker,
	emotion: emotion,
	emotionLevel: z.number().min(1).max(4),
	pitch: z.number().min(1).max(200),
	speed: z.number().min(1).max(400),
	createdAt: z.string().nullable(),
	updatedAt: z.string().nullable(),
});

const userInfoSchema = z.object({
	memberDisplayName: z.string(),
	memberAvatarUrl: z.string().url(),
});

export const userDataSchema = z.object({
	ttsData: ttsDataSchema,
	userInfo: userInfoSchema,
});

export const userDataViewSchema = z.object({
	ttsData: ttsDataViewSchema,
	userInfo: userInfoSchema,
});

export const ttsSettingsSchema = z.object({
	mainData: userDataSchema,
	subDatas: userDataSchema.array(),
});

export const ttsSettingsViewSchema = z.object({
	mainData: userDataViewSchema,
	subDatas: userDataViewSchema.array(),
});

export type UserDataSchema = z.infer<typeof userDataSchema>;

export type TtsSettingsSchema = z.infer<typeof ttsSettingsSchema>;
export type TtsSettingsViewSchema = z.infer<typeof ttsSettingsViewSchema>;
export type TtsTransformMessageInputSchema = z.infer<
	typeof ttsTransformMessageInputSchema
>;
