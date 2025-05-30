import type { dictionaryFilterWithEnable } from '../filters';

export function replace(baseText: string) {
	function kusa() {
		return baseText.replace(/[wWｗＷ]{2,}/g, '草');
	}

	function fromDB(
		dictinaries: dictionaryFilterWithEnable[],
		replacedText: string,
	) {
		for (const dict of dictinaries) {
			replacedText = replacedText.replace(dict.beforeWord, dict.afterWord);
		}
		return replacedText;
	}

	function auto(
		globalDictionaries: dictionaryFilterWithEnable[],
		userDictionaries: dictionaryFilterWithEnable[],
		maxLength?: number,
	) {
		let replacedText = kusa();

		if (userDictionaries.length !== 0) {
			replacedText = fromDB(userDictionaries, replacedText);
		}

		if (globalDictionaries.length !== 0) {
			replacedText = fromDB(globalDictionaries, replacedText);
		}

		if (maxLength !== undefined) {
			replacedText = replacedText.slice(0, 100);
		}
		return replacedText;
	}

	return { kusa, fromDB, auto };
}
