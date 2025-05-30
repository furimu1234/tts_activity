import type {
	AddDictionaryRequestSchema,
	DictionariesRequestSchema,
	DictionariesResponseSchema,
	DictionaryResponseSchema,
	EditDictionaryRequestSchema,
	ToggleDictionaryRequestSchema,
} from '@tts/serverschema';
import { useCallback, useEffect, useState } from 'react';
import { Routes } from '../Routes';
import { useDialog } from '../providers';
import { authStore } from '../store/authStore';

export const useDictionariesOperation = () => {
	const [items, setItems] = useState<DictionaryResponseSchema[]>([]);
	const [isEnable, setIsEnable] = useState<boolean>(false);
	const auth = authStore();
	const { showError, showConfirm } = useDialog();

	/**編集可 */
	const isEditable = useCallback(
		(item: DictionaryResponseSchema) => {
			if (item.parentId === 'global' && item.createrId === auth.user.id) {
				return true;
			}
			if (item.parentId === auth.user.id) {
				return true;
			}
			return false;
		},
		[auth],
	);

	const getDictionaries =
		useCallback(async (): Promise<DictionariesResponseSchema> => {
			console.log(isEnable);
			const body = {
				userId: auth.user.id,
				ignore: isEnable,
			} satisfies DictionariesRequestSchema;

			const response = await fetch(Routes.API.getDictionaries, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});

			return await response.json();
		}, [auth, isEnable]);

	const reload = useCallback(async () => {
		const response = await getDictionaries();

		const globalDictionaries = response.globalDictionaries.filter(
			(x) => x.parentId === 'global',
		);

		const userDictinaries = response.userDictionaries.filter(
			(x) => x.parentId === auth.user.id,
		);

		setItems([...userDictinaries, ...globalDictionaries]);
	}, [auth, getDictionaries]);

	useEffect(() => {
		reload();
	}, [reload]);

	async function addDictionary(item: AddDictionaryRequestSchema) {
		const confirmed = await showConfirm({
			title: '登録確認画面',
			message: '登録しますか？',
			color: 'success',
		});

		if (!confirmed) return;

		const response = await fetch(Routes.API.addDictionaries, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(item),
		});

		try {
			const res: { message: string } = await response.json();

			if (response.status !== 200) {
				showError('辞書登録失敗', res.message);
				return;
			}
		} catch {
			showError(
				'辞書登録失敗',
				'不明なエラーが発生しました。連続で発生する場合は、アクティビティを再度起動してみてください。',
			);
			return;
		}

		await reload();
	}

	async function editDictionary(item: EditDictionaryRequestSchema) {
		const confirmed = await showConfirm({
			title: '変種確認画面',
			message: '編集しますか？',
			color: 'success',
		});

		if (!confirmed) return;

		await fetch(Routes.API.updateDictionaries, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(item),
		});

		await reload();
	}

	async function toggleEnable(dictinaryId: number) {
		const body = {
			dictionaryId: dictinaryId,
			userId: auth.user.id,
		} satisfies ToggleDictionaryRequestSchema;

		const response = await fetch(`${Routes.API.toggleEnableDictionaries}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		const res: { message: string } = await response.json();

		switch (response.status) {
			case 404:
				showError('切り替え失敗', res.message);
				break;
			case 200:
				await reload();
				break;
			default:
				showError(
					'切り替え失敗',
					'不明なエラーが発生しました。時間をおいて再度実行してみてください。',
				);
		}
	}

	return {
		items,
		userId: auth.user.id,
		addDictionary,
		toggleEnable,
		isEditable,
		editDictionary,
		isEnable,
		setIsEnable,
	};
};
