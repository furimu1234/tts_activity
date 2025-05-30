const APIBASE = '.proxy/api';

export const Routes = {
	API: {
		getVoiceSetting: `${APIBASE}/getVoiceSetting`,
		getToken: `${APIBASE}/token`,
		patchVoiceSetting: `${APIBASE}/patch_voice_setting`,
		getDictionaries: `${APIBASE}/get_dictionaries`,
		addDictionaries: `${APIBASE}/add_dictionaries`,
		updateDictionaries: `${APIBASE}/update_dictionaries`,
		deleteDictionaries: `${APIBASE}/delete_dictionaries`,
		toggleEnableDictionaries: `${APIBASE}/toggle_enable_dictionaries`,
	},
	WS: {
		BASE: `${APIBASE}/ws`,
	},
	VIEW: {
		TTS: '/tts',
		TtsSetting: '/ttsSetting',
	},
};
