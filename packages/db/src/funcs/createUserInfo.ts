import { userInfo } from '../';
import type { SchemaDB } from '../client';

/**
 * 辞書作成
 * @param db drizzle
 * @param userId userId
 * @returns
 */
export async function createUserInfo(
	db: SchemaDB,
	userId: string,
	userAvatarUrl: string,
	userDisplayName: string,
) {
	const results = await db
		.insert(userInfo)
		.values({
			textLength: 100,
			userAvatarUrl: userAvatarUrl,
			userDisplayName: userDisplayName,
			userId: userId,
		})
		.returning();

	if (results.length === 0) throw new Error('');

	return results[0];
}
