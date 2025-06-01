import {
	type insertUsersVoicePreferenceInterface,
	type mainVoiceSettingFilter,
	usersVoicePreference,
	voicePreference,
} from '../';
import type { SchemaDB } from '../client';

import { getRandomEmotion, getRandomInRange, getRandomSpeaker } from './utils';
/**
 * voice text webapiの設定を登録する
 * @param db drizzle
 * @param userid 設定を登録するユーザのID
 * @returns
 */
export async function createVoiceSetting(db: SchemaDB, userId: string) {
	const results = await db
		.insert(voicePreference)
		.values({
			userId: userId,
			speaker: getRandomSpeaker(),
			emotion: getRandomEmotion(),
			emotionLevel: getRandomInRange(1, 4),
			pitch: getRandomInRange(50, 100),
			speed: 100,
		})
		.returning();

	if (results.length === 0) throw new Error('');

	return results[0];
}

/**
 * voice text webapiの設定を登録する
 * @param db drizzle
 * @param userid 設定を登録するユーザのID
 * @returns
 */
export async function createSubVoiceSetting(
	db: SchemaDB,
	parentUserId: string,
	userId: string,
	voiceData?: mainVoiceSettingFilter,
) {
	let values = {
		userId: userId,
		parentId: parentUserId,
		speaker: getRandomSpeaker(),
		emotion: getRandomEmotion(),
		emotionLevel: getRandomInRange(1, 4),
		pitch: getRandomInRange(50, 100),
		speed: 100,
		isMuted: false,
		isSelfEdited: false,
	} satisfies insertUsersVoicePreferenceInterface;

	//idを削除
	if (!voiceData?.speaker) {
		const value = await createVoiceSetting(db, userId);
		const { id, ...rest } = value;

		values = {
			...rest,
			parentId: parentUserId,
			isMuted: false,
			isSelfEdited: false,
		};
	} else if (voiceData) {
		const { id, ...rest } = voiceData;

		values = {
			...values,
			...rest,
			parentId: parentUserId,
		};
	}

	const results = await db
		.insert(usersVoicePreference)
		.values(values)
		.returning();

	if (results.length === 0) throw new Error('');

	return results[0];
}
