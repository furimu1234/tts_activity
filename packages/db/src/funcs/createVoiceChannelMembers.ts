import { type memberInfo, voiceChannelMembers } from '../';
import type { SchemaDB } from '../client';

/**
 * voicechannel内のメンバー一覧
 * @param db drizzle
 * @param channelId channelid
 * @param firstMemberId 最初のユーザーID
 * @returns
 */
export async function createVoiceChannelMembers(
	db: SchemaDB,
	channelId: string,
) {
	const results = await db
		.insert(voiceChannelMembers)
		.values({
			channelId: channelId,
			memberInfos: {} as memberInfo,
		})
		.returning();

	if (results.length === 0) throw new Error('');

	return results[0];
}
