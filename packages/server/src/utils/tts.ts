import {
	type SchemaDB,
	createSubVoiceSetting,
	createVoiceSetting,
	getVoiceByte,
	getVoiceSetting,
	getVoiceSubSetting,
	type usersVoicePreference,
	type voiceByteInterface,
	type voicePreference,
} from '@tts/db';
import type { InferInsertModel } from 'drizzle-orm';
import type { MessageType } from '../types';

export async function makeVoiceBinFromMessage(
	db: SchemaDB,
	data: MessageType,
	apiKey: string,
	baseUrl: string,
): Promise<{ voiceData: voiceByteInterface; userId: string }[]> {
	const _voiceSettings = data.memberIds.map(async (x) => {
		let parentSetting = await getVoiceSetting(db, data.author_id);

		if (!parentSetting) {
			parentSetting = await createVoiceSetting(db, data.author_id);
		}
		console.log("parentSetting: ", parentSetting)

		if (data.author_id === x) {
			console.log("メインユーザー: ", x)
			const voiceData = await getVoiceByte({
				db,
				apiKey: apiKey,
				baseUrl: baseUrl,
				text: data.message,
				...parentSetting,
			});

			return { voiceData, userId: x };
		}

		let voiceSetting = await getVoiceSubSetting(db, x, data.author_id);
		if (!voiceSetting) {
			voiceSetting = await createSubVoiceSetting(db, x, data.author_id);
		}

		if (!voiceSetting) return;

		const voiceData = await getVoiceByte({
			db,
			apiKey: apiKey,
			baseUrl: baseUrl,
			text: data.message,
			...voiceSetting,
		});

		return { voiceData, userId: x };
	});

	return (await Promise.all(_voiceSettings)).filter((x) => !!x);
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
