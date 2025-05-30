import { zValidator } from '@hono/zod-validator';
import {
	createDictionary,
	getDictionaries,
	getGlobalDictionaries,
	getUserInfo,
	ignoreDisableDictionaries,
	toggleDictionaryEnable,
	updateDictionary,
} from '@tts/db';
import {
	addDictionaryBodySchema,
	editDictionariesBodySchema,
	getDictionariesBodySchema,
	toggleDictionaryBodySchema,
} from '@tts/serverschema';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { dataStoreContainer } from '../container';
import type { Env } from '../types';

const app = new Hono<{
	Bindings: Env;
}>();
app.onError((err, c) => {
	console.error('❌ onError:', err);
	return c.json({ message: err.message }, 500);
});

/**画面を開いてるユーザの辞書設定一覧を取得
 *
 */
app.post(
	'/get_dictionaries',
	zValidator('json', getDictionariesBodySchema, (result, c) => {}),
	async (c) => {
		const body = await c.req.valid('json');

		const store = dataStoreContainer.getDataStore(c);
		const dictionaries = await store.do(async (db) => {
			const userInfo = await getUserInfo(db, body.userId);
			const globalDictionaries = await getGlobalDictionaries(db, body.userId);

			return await ignoreDisableDictionaries(
				globalDictionaries,
				userInfo?.dictionaries ?? [],
				!body.ignore,
			);
		});
		console.log(dictionaries);

		return c.json(dictionaries, 200);
	},
);

/**辞書登録 */
app.post(
	'/add_dictionaries',
	zValidator('json', addDictionaryBodySchema, (result, c) => {}),
	async (c) => {
		const body = await c.req.valid('json');

		const store = dataStoreContainer.getDataStore(c);
		await store.do(async (db) => {
			const beforeWordDictionaries = await getDictionaries(db, {
				beforeWord: body.beforeWord,
			});

			const myBeforeWordDictionaries = beforeWordDictionaries.filter((x) =>
				['global', body.createrId].includes(x.parentId),
			);

			if (myBeforeWordDictionaries.length > 0) {
				throw new HTTPException(500, {
					message: `既に${body.beforeWord}は登録されてます。`,
				});
			}

			await createDictionary(
				db,
				body.parentId,
				body.createrId,
				body.beforeWord,
				body.afterWord,
			);
		});

		return c.json({ message: 'OK' }, 200);
	},
);

/**変換後単語更新 */
app.put(
	'/update_dictionaries',
	zValidator('json', editDictionariesBodySchema, (result, c) => {}),
	async (c) => {
		const body = await c.req.valid('json');

		const store = dataStoreContainer.getDataStore(c);
		await store.do(async (db) => {
			await updateDictionary(db, { afterWord: body.afterWord, id: body.id });
		});

		return c.json({ message: 'OK' }, 200);
	},
);

/**辞書の有効状況(個人)を更新 */
app.put(
	'/toggle_enable_dictionaries',
	zValidator('json', toggleDictionaryBodySchema),
	async (c) => {
		const { dictionaryId, userId } = await c.req.valid('json');

		const store = dataStoreContainer.getDataStore(c);
		await store.do(async (db) => {
			const find = await getDictionaries(db, { id: dictionaryId });

			if (find.length === 0)
				throw new HTTPException(404, {
					message:
						'指定した列のデータが見つかりませんでした。一時的な不具合の可能性があります。',
				});

			await toggleDictionaryEnable(db, {
				dictionaryId: dictionaryId,
				userId: userId,
			});
		});

		return c.json({ message: 'OK' }, 200);
	},
);
export default app;
