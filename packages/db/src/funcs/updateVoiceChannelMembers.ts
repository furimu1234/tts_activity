import { type InferInsertModel, eq } from 'drizzle-orm';
import { type SchemaDB, voiceChannelMembers } from '../';
type UpdateVoice = Pick<
	InferInsertModel<typeof voiceChannelMembers>,
	'channelId' | 'memberInfos'
>;

/**
 * voice channel memberを更新する
 * @param db drizzle
 * @param values
 * @returns
 */
export async function updateVoiceChannelMembers(
	db: SchemaDB,
	values: UpdateVoice,
) {
	const effects = await db
		.update(voiceChannelMembers)
		.set(values)
		.where(eq(voiceChannelMembers.channelId, values.channelId))
		.returning();

	if (effects.length === 0) return undefined;

	return effects[0];
}
