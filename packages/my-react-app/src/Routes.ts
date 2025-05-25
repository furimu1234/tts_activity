const APIBASE = '.proxy/api';

export const Routes = {
	API: {
		getVoiceSetting: `${APIBASE}/getVoiceSetting`,
		getToken: `${APIBASE}/token`,
		patchVoiceSetting: `${APIBASE}/patch_voice_setting`,
	},
	WS: {
		BASE: `${APIBASE}/ws`,
	},
	VIEW: {
		TTS: '/tts',
		TtsSetting: '/ttsSetting',
	},
};
