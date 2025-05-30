import { z } from 'zod';
import {} from '.';

import type {
	addDictionaryBodySchema,
	dictionariesSchema,
	dictionarySchema,
	editDictionariesBodySchema,
	getDictionariesBodySchema,
	toggleDictionaryBodySchema,
} from './dictionary';
import type {
	ttsTransformMessageBodySchema,
	ttsWavDataWithUserIdSchema,
} from './tts';
import { type userDataWithTtsSchema, userDataWithTtsViewSchema } from './user';

/**読み上げ設定一覧取得画面スキーマ
 * 画面を表示してる人
 * 同じVCにいる人
 */
export const ttsSettingsViewSchema = z.object({
	mainData: userDataWithTtsViewSchema,
	subDatas: userDataWithTtsViewSchema.array(),
});

/**辞書一覧取得画面 */
export type DictionariesResponseSchema = z.infer<typeof dictionariesSchema>;

/**辞書一覧取得body画面 */
export type DictionariesRequestSchema = z.infer<
	typeof getDictionariesBodySchema
>;

/**辞書取得画面 */
export type DictionaryResponseSchema = z.infer<typeof dictionarySchema>;

/**辞書登録画面body */
export type AddDictionaryRequestSchema = z.infer<
	typeof addDictionaryBodySchema
>;

/**辞書更新body */
export type EditDictionaryRequestSchema = z.infer<
	typeof editDictionariesBodySchema
>;

/**辞書有効状況更新body */
export type ToggleDictionaryRequestSchema = z.infer<
	typeof toggleDictionaryBodySchema
>;

/**読み上げ情報取得 */
export type WavDataWithUserIdResponseSchema = z.infer<
	typeof ttsWavDataWithUserIdSchema
>;

/**読み上げ設定とその設定を登録したユーザ情報取得 */
export type UserDataWithTtsResponseSchema = z.infer<
	typeof userDataWithTtsSchema
>;

/**読み上げ設定一覧取得 */
export type TtsSettingsResponseSchema = z.infer<typeof ttsSettingsViewSchema>;

/**読み上げ情報送信 */
export type TtsTransformMessageRequestSchema = z.infer<
	typeof ttsTransformMessageBodySchema
>;
