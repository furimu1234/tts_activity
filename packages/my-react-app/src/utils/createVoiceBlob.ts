export function createVoiceBlob(wavData: string) {
	const binary = atob(wavData);
	const len = binary.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binary.charCodeAt(i);
	}

	return new Blob([bytes], { type: 'audio/wav' });
}
