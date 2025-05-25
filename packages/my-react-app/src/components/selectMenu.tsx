import type { emotion, speaker } from '@tts/db';
import type React from 'react';
import type { CardData } from './props'; // 既存の型

interface SelectMenuProps<T extends speaker | emotion> {
	/** select の id 属性（label と紐づけるため） */
	id?: string;
	/** ラベル文言 */
	label: string;
	/** CardData のどのフィールドを更新するか */
	field: keyof CardData;
	/** 現在選択中の値 */
	value: string;
	/** 選択肢一覧 */
	options: Record<T, string>;
	/** onChange ハンドラ */
	handleChange: (field: keyof CardData, value: string | number) => void;
}

export const SelectMenu: React.FC<SelectMenuProps> = ({
	id = 'select-menu',
	label,
	field,
	value,
	options,
	handleChange,
}) => (
	<div>
		<label htmlFor={id} className="block text-sm text-white">
			{label}
		</label>
		<select
			id={id}
			value={value}
			onChange={(e) => handleChange(field, e.target.value)}
			className="mt-1 block w-full border rounded p-1 bg-gray-800 text-white"
		>
			{Object.keys(options).map((key) => (
				<option key={key} value={key} className="bg-gray-800">
					{options[key]}
				</option>
			))}
		</select>
	</div>
);
