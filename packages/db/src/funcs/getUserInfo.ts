import { and, eq, or } from 'drizzle-orm';
import { createDictionaryEnable, dictionary, userInfo } from '../';
import type { SchemaDB } from '../client';
import { geDictionaryEnable } from './getDictionaryEnable';

/**
 * ユーザ情報取得
 * @param db drizzle
 * @param userId ユーザID
 * @returns
 */
export async function getUserInfo(db: SchemaDB, userId: string) {
	const result = await db.query.userInfo.findFirst({
		where: eq(userInfo.userId, userId),
		with: {
			dictionaries: {
				where: and(
					or(
						eq(dictionary.parentId, userId),
						eq(dictionary.parentId, 'global'),
					),
				),
			},
		},
	});

	if (!result) return;

	const newDictionaries = await Promise.all(
		result.dictionaries.map(async (x) => {
			let enableData = await geDictionaryEnable(db, x.id, userId);

			if (!enableData) {
				enableData = await createDictionaryEnable(db, {
					dictionaryId: x.id,
					disabled: false,
					userId: userId,
				});
			}

			return {
				...x,
				enable: !enableData.disabled,
			};
		}),
	);

	return {
		...result,
		dictionaries: newDictionaries,
	};
}
