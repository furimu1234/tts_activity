import type { TtsSettingsResponseSchema } from '@tts/serverschema';

export type CardData = TtsSettingsResponseSchema['mainData'];
export type TtsData = CardData['ttsData'];
