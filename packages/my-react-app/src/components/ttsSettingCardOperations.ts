import {
	type TtsSettingsViewSchema,
	ttsSettingsViewSchema,
} from '@tts/serverschema';
import { useCallback, useEffect, useState } from 'react';
import { Routes } from '../Routes';
import { discordSdk } from '../discord';
import { authStore } from '../store/authStore';
import type { CardData, TtsData } from './props';

async function getUserVoiceSettings(mainUserId: string, channelId: string) {
	const VoiceSettings = await fetch(`${Routes.API.getVoiceSetting}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ mainUserId: mainUserId, channelId: channelId }),
	});

	const responseData: TtsSettingsViewSchema = await VoiceSettings.json();
	const _parsed = ttsSettingsViewSchema.safeParse(responseData);

	if (_parsed.error) {
		//TODO: ERRORを画面に表示
		console.log(_parsed.error.issues);
		return;
	}
	const parsed = _parsed.data;
	console.log(parsed);

	return { mainData: parsed.mainData, subDatas: parsed.subDatas };
}

export const useTtsSettingOperation = () => {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formState, setFormState] = useState<TtsData>({});

	const authstore = authStore();

	const userId = authstore.user.id;

	const [items, setItems] = useState<CardData[]>([]);

	const reload = useCallback(async () => {
		const voiceSetting = await getUserVoiceSettings(
			userId,
			discordSdk.channelId,
		);

		const values = [voiceSetting.mainData].concat(voiceSetting.subDatas ?? []);
		setItems(values);
		setEditingId(null);
		setFormState({});
	}, [userId]);

	useEffect(() => {
		reload();

		// クリーンアップ
		return () => {};
	}, [reload]);

	const startEdit = (item: CardData) => {
		setEditingId(item.ttsData.userId);
		setFormState(item.ttsData);
	};

	const handleChange = (field: keyof TtsData, value: string | number) => {
		setFormState((prev) => ({ ...prev, [field]: value }));
	};

	const save = async () => {
		if (!editingId && !formState) return;
		console.log(JSON.stringify(formState));

		const body = {
			...formState,
			mainUserId: userId,
		};

		const response = await fetch(Routes.API.patchVoiceSetting, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		if (response.status !== 200) {
			return;
		}

		await reload();
	};

	return {
		items,
		editingId,
		setEditingId,
		formState,
		setFormState,
		startEdit,
		handleChange,
		save,
	};
};
