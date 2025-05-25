import type { emotion, speaker } from '@tts/db';
import {
	emotionToEnRecord,
	emotionToJpRecord,
	speakerToEnRecord,
	speakerToJpRecord,
} from '@tts/serverschema';

export function speakerToJp(speaker: speaker) {
	return speakerToJpRecord[speaker];
}

export function speakerToEn(speaker: string) {
	return speakerToEnRecord[speaker];
}

export function emotionToJp(emotion: emotion) {
	return emotionToJpRecord[emotion];
}
export function emotionToEn(emotion: string) {
	return emotionToEnRecord[emotion];
}
