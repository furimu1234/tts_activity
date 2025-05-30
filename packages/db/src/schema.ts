import { relations } from 'drizzle-orm';
import {
	boolean,
	index,
	integer,
	jsonb,
	pgSchema,
	serial,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';
import type { emotion, memberInfo, speaker } from './handmeid';

const dbSchema = pgSchema('tts');

export const voicePreference = dbSchema.table(
	'voice_preference',
	{
		id: serial('id').primaryKey(),
		userId: varchar('user_id', { length: 19 }).notNull(),
		speaker: varchar({ length: 6 }).notNull().$type<speaker>(),
		emotion: varchar({ length: 9 }).notNull().$type<emotion>(),
		emotionLevel: integer('emotion_level').notNull(),
		pitch: integer('pitch').notNull(),
		speed: integer('speed').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [index('user_idx').on(table.userId)],
);

export const usersVoicePreference = dbSchema.table(
	'users_voice_preference',
	{
		id: serial('id').primaryKey(),
		parentId: varchar('parent_id', { length: 19 }).notNull(),
		userId: varchar('user_id', { length: 19 }).notNull(),
		speaker: varchar({ length: 6 }).notNull().$type<speaker>(),
		emotion: varchar({ length: 9 }).notNull().$type<emotion>(),
		emotionLevel: integer('emotion_level').notNull(),
		pitch: integer('pitch').notNull(),
		speed: integer('speed').notNull(),
		isMuted: boolean('is_mnuted').notNull(),
		isSelfEdited: boolean('is_self_edited').notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [index('parent_user_idx').on(table.parentId, table.userId)],
);

export const voiceChannelMembers = dbSchema.table(
	'voice_channel_members',
	{
		id: serial('id').primaryKey(),
		channelId: varchar('channel_id', { length: 19 }).notNull().unique(),
		memberInfos: jsonb('member_ids').notNull().$type<memberInfo>(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [index('channel_idx').on(table.channelId, table.channelId)],
);

export const dictionary = dbSchema.table('dictionary', {
	id: serial('id').primaryKey(),
	parentId: varchar('parent_id', { length: 19 }).notNull(),
	createrId: varchar('creater_id', { length: 19 }).notNull(),
	beforeWord: text('before_word').notNull(),
	afterWord: text('after_word').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date()),
});

//TOOD: global辞書で有効状況を個人で持たないといけない

export const dictionaryEnable = dbSchema.table('dictionary_enable', {
	id: serial('id').primaryKey(),
	userId: varchar('user_id', { length: 19 }).notNull(),
	dictionaryId: integer('dictionary_id').notNull(),
	disabled: boolean().notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const userInfo = dbSchema.table('userInfo', {
	userId: varchar('user_id', { length: 19 }).notNull().unique(),
	userAvatarUrl: text('user_avatar_url').notNull(),
	userDisplayName: text('user_display_name').notNull(),
	textLength: integer('text_length').notNull(),
});

export const creatorRelations = relations(voicePreference, ({ many }) => ({
	usersVoicePreference: many(usersVoicePreference),
}));
export const usersRelations = relations(usersVoicePreference, ({ one }) => ({
	parentId: one(voicePreference, {
		fields: [usersVoicePreference.parentId],
		references: [voicePreference.userId],
	}),
}));

export const userInfoRelations = relations(userInfo, ({ many }) => ({
	dictionaries: many(dictionary),
}));

export const dictionaryRelations = relations(dictionary, ({ one }) => ({
	creator: one(userInfo, {
		relationName: 'userDictionaries',
		fields: [dictionary.parentId],
		references: [userInfo.userId],
	}),
}));
