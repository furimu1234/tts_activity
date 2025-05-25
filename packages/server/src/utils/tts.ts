import {
	type SchemaDB,
	createVoiceSetting,
	getVoiceByte,
	getVoiceSetting,
	type usersVoicePreference,
	type voicePreference,
} from '@tts/db';
import type { InferInsertModel } from 'drizzle-orm';
import type { MessageType } from '../types';

export async function makeVoiceBinFromMessage(
	db: SchemaDB,
	data: MessageType,
	apiKey: string,
	baseUrl: string,
) {
	let voiceSetting = await getVoiceSetting(db, data.author_id);

	if (!voiceSetting) {
		voiceSetting = await createVoiceSetting(db, data.author_id);
	}

	if (!voiceSetting) return undefined;

	return await getVoiceByte({
		apiKey: apiKey,
		baseUrl: baseUrl,
		text: data.message,
		...voiceSetting,
	});
}

export async function createParentData(data?: {
	voice_preference: InferInsertModel<typeof voicePreference>;
	users_voice_preference: InferInsertModel<typeof usersVoicePreference> | null;
}) {
	if (!data) return undefined;

	return {
		speaker: data.voice_preference.speaker,
		emotion: data.voice_preference.emotion,
		emotionLevel: data.voice_preference.emotionLevel,
		pitch: data.voice_preference.pitch,
		speed: data.users_voice_preference?.speed,
	};
}
