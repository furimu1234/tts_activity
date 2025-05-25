import { eq } from 'drizzle-orm';
import { voiceChannelMembers } from '../';
import type { SchemaDB } from '../client';

/**
 * voicechannel内のメンバー一覧
 * @param db prisma
 * @param channelId メンバーを取得するチャンネルのID
 * @returns
 */
export async function getVoiceChannelMembers(db: SchemaDB, channelId: string) {
	const results = await db
		.select()
		.from(voiceChannelMembers)
		.where(eq(voiceChannelMembers.channelId, channelId));

	if (results.length === 0) return undefined;

	return results[0];
}
