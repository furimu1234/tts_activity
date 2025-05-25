import { z } from 'zod';
import { type emotion, emotions, type speaker, speakers } from '../';

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
	baseUrl: string;
	apiKey: string;
	text: string;
	speaker: speaker;
	emotion?: emotion | null;
	emotionLevel?: number | null;
	pitch: number;
	speed: number;
	volume?: number;
	authorId?: number;
}

export async function getVoiceByte({
	baseUrl,
	apiKey,
	text,
	speaker,
	emotion,
	emotionLevel,
	pitch,
	speed,
	volume = 100,
	authorId,
}: VoiceTextParams): Promise<Uint8Array | null> {
	const readParams: Record<string, string | number> = {
		text,
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
			return null;
		}
		readParams.emotion = emotion;
		readParams.emotion_level = emotionLevel;
	}

	const form = new URLSearchParams();
	for (const [key, value] of Object.entries(readParams)) {
		form.append(key, value.toString());
	}

	try {
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

		let logMessage = `バイトサイズ: ${byteArray.byteLength}`;
		if (authorId !== undefined) {
			logMessage += ` authorId=${authorId}`;
		}

		console.info(logMessage);

		return byteArray;
	} catch (error) {
		console.error('Failed to create voice byte:', error);
		return null;
	}
}

export const zodenumFromObjKeys = <K extends string>(
	obj: Record<K, unknown>,
): z.ZodEnum<[K, ...K[]]> => {
	const [firstKey, ...otherKeys] = Object.keys(obj) as K[];
	return z.enum([firstKey, ...otherKeys]);
};
