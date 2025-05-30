import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type {
	dictionary,
	usersVoicePreference,
	voiceChannelMembers,
	voicePreference,
} from './';
import type { emotion, speaker } from './handmeid';
export interface voiceSettingFilter {
	voice_preference: InferSelectModel<typeof voicePreference> | null;
	users_voice_preference: InferSelectModel<typeof usersVoicePreference> | null;
}
export type mainVoiceSettingFilter = InferSelectModel<typeof voicePreference>;

export type subVoiceSettingFilter = InferSelectModel<
	typeof usersVoicePreference
>;

export type voiceChannelMembersFilter = InferSelectModel<
	typeof voiceChannelMembers
>;

export interface insertUsersVoicePreferenceInterface
	extends InferInsertModel<typeof usersVoicePreference> {
	speaker: speaker;
	emotion: emotion;
	emotionLevel: number;
	pitch: number;
	isMuted: boolean;
}

export type dictionaryFilter = InferSelectModel<typeof dictionary>;
export type dictionaryFilterWithEnable = InferSelectModel<typeof dictionary> & {
	enable: boolean;
};
