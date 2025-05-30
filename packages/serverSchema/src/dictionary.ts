import { z } from 'zod';

/**辞書一覧取得APIスキーマ */
export const getDictionariesBodySchema = z.object({
	userId: z.string().min(1).max(19),
	ignore: z.boolean(),
});

/**辞書追加APIスキーマ */
export const addDictionaryBodySchema = z.object({
	createrId: z.string().min(1).max(19),
	parentId: z.string().min(1).max(19),
	beforeWord: z
		.string()
		.min(3, '3文字以上で入力してください')
		.max(50, '50文字以内で入力してください'),
	afterWord: z
		.string()
		.min(3, '3文字以上で入力してください')
		.max(50, '50文字以内で入力してください'),
});

/**辞書更新APIスキーマ */
export const editDictionariesBodySchema = z.object({
	id: z.number(),
	afterWord: z.string().min(1),
});

/**辞書有効切替APIスキーマ */
export const toggleDictionaryBodySchema = z.object({
	dictionaryId: z.number(),
	userId: z.string().min(1).max(19),
});

/**辞書スキーマ */
export const dictionarySchema = z.object({
	id: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
	parentId: z.string().min(1).max(19),
	createrId: z.string().min(1).max(19),
	beforeWord: z.string(),
	afterWord: z.string(),
	enable: z.boolean(),
});

/**辞書一覧取得スキーマ */
export const dictionariesSchema = z.object({
	globalDictionaries: dictionarySchema.array(),
	userDictionaries: dictionarySchema.array(),
});
