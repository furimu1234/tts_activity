import { z } from 'zod';
import {
	type SchemaDB,
	type dictionaryFilterWithEnable,
	type emotion,
	emotions,
	getGlobalDictionaries,
	getUserInfo,
	type speaker,
	speakers,
} from '../';
import { replace } from './replace';

export function getRandomSpeaker(): speaker {
	const randomIndex = Math.floor(Math.random() * speakers.length);
	return speakers[randomIndex];
}
export function getRandomEmotion(): emotion {
	const randomIndex = Math.floor(Math.random() * emotions.length);
	return emotions[randomIndex];
}

export function getRandomInRange(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface VoiceTextParams {
	db: SchemaDB;
	baseUrl: string;
	apiKey: string;
	text: string;
	userId: string;
	speaker: speaker;
	emotion?: emotion | null;
	emotionLevel?: number | null;
	pitch: number;
	speed: number;
	volume?: number;
}

export interface voiceByteInterface {
	byteArray: Uint8Array | null;
	replacedText: string;
}

export async function getVoiceByte({
	db,
	baseUrl,
	apiKey,
	text,
	userId,
	speaker,
	emotion,
	emotionLevel,
	pitch,
	speed,
	volume = 100,
}: VoiceTextParams): Promise<voiceByteInterface> {
	const Replace = replace(text);

	const userInfo = await getUserInfo(db, userId);

	if (!userInfo) return {} as voiceByteInterface;

	const globalDictionaries = (await getGlobalDictionaries(db, userId)) ?? [];
	const userDictionaries = userInfo.dictionaries.filter(
		(x) => x.parentId !== 'global',
	);

	const dictionaries = await ignoreDisableDictionaries(
		globalDictionaries,
		userDictionaries,
	);

	const replacedText = Replace.auto(
		dictionaries.globalDictionaries,
		dictionaries.userDictionaries,
	);

	console.log("replacedText: ", replacedText)

	const readParams: Record<string, string | number> = {
		text: replacedText,
		speaker,
		pitch,
		speed,
		volume,
	};

	if (speaker !== 'show') {
		if (!emotion || emotionLevel == null) {
			console.error(
				"Emotion and emotionLevel are required for speakers other than 'show'.",
			);
			return {} as voiceByteInterface;
		}
		readParams.emotion = emotion;
		readParams.emotion_level = emotionLevel;
	}

	const form = new URLSearchParams();
	for (const [key, value] of Object.entries(readParams)) {
		form.append(key, value.toString());
	}

	console.log("readParam: ", readParams)

		const response = await fetch(baseUrl, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${btoa(`${apiKey}:`)}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: form.toString(),
		});



		if (!response.ok) {
			const contentType = response.headers.get('content-type');
			const errorData = contentType?.includes('application/json')
				? JSON.stringify(await response.json())
				: await response.text();

			console.error(`status=${response.status} error=${errorData}`);
			throw new Error(`MakeException: ${response.status}, ${errorData}`);
		}

		const arrayBuffer = await response.arrayBuffer();
		const byteArray = new Uint8Array(arrayBuffer);

		return { byteArray, replacedText };
	
}

export const zodenumFromObjKeys = <K extends string>(
	obj: Record<K, unknown>,
): z.ZodEnum<[K, ...K[]]> => {
	const [firstKey, ...otherKeys] = Object.keys(obj) as K[];
	return z.enum([firstKey, ...otherKeys]);
};

interface disableDictionariesInterface {
	globalDictionaries: dictionaryFilterWithEnable[];
	userDictionaries: dictionaryFilterWithEnable[];
}

/**無効化辞書を除外する */
export async function ignoreDisableDictionaries(
	globalDictionaries: dictionaryFilterWithEnable[],
	userDictionaries: dictionaryFilterWithEnable[],
	ignore = true,
): Promise<disableDictionariesInterface> {
	let filterdGlobal = globalDictionaries;
	let filterdUser = userDictionaries;
	console.log(ignore, filterdGlobal, filterdUser);

	if (ignore) {
		filterdGlobal = globalDictionaries.filter((x) => x.enable === true);
		filterdUser = userDictionaries.filter((x) => x.enable === true);
	}
	return {
		globalDictionaries: filterdGlobal,
		userDictionaries: filterdUser,
	};
}
