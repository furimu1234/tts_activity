import { zodResolver } from '@hookform/resolvers/zod';
import {
	Button,
	DialogActions,
	DialogTitle,
	FormControl,
	FormControlLabel,
	Switch,
	TextField,
} from '@mui/material';
import {
	type AddDictionaryRequestSchema,
	addDictionaryBodySchema,
} from '@tts/serverschema';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { authStore } from '../../store/authStore';

const myStyle = {
	'& .MuiInputBase-input': {
		color: 'white', // 入力文字の色
	},
	'& label': {
		color: 'white', // 通常時のラベル色
	},
	'& .MuiInput-underline:before': {
		borderBottomColor: 'white', // 通常時のボーダー色
	},
	'& .MuiOutlinedInput-root': {
		'& fieldset': {
			borderColor: 'white', // 通常時のボーダー色(アウトライン)
		},
	},
};

interface AddModalProps {
	onClose: () => void;
	onAdd: (item: AddDictionaryRequestSchema) => void;
}
const AddModal = ({ onAdd, onClose }: AddModalProps) => {
	const auth = authStore();
	const [item, setItem] = useState<AddDictionaryRequestSchema>({
		createrId: auth.user.id,
		afterWord: '',
		beforeWord: '',
		parentId: 'global',
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
		control,
	} = useForm<AddDictionaryRequestSchema>({
		mode: 'onChange',
		resolver: zodResolver(addDictionaryBodySchema),
		defaultValues: {
			createrId: auth.user.id,
			parentId: 'global',
		},
	});

	function onSubmit(data: AddDictionaryRequestSchema) {
		onAdd(data);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name="parentId"
				control={control}
				render={({ field }) => {
					return (
						<FormControlLabel
							className="text-white"
							control={
								<Switch
									defaultChecked
									onChange={(e) => {
										const newValue = e.target.checked ? 'global' : auth.user.id;
										field.onChange(newValue);
									}}
								/>
							}
							label={field.value === 'global' ? '全体適用' : '自分のみ'}
						/>
					);
				}}
			/>
			<DialogTitle color="white">追加画面</DialogTitle>
			<FormControl>
				<TextField
					id="beforeWord"
					label="変換前の単語"
					sx={myStyle}
					{...register('beforeWord')}
					error={!!errors.beforeWord}
					helperText={errors.beforeWord?.message}
				/>
			</FormControl>
			<FormControl sx={{ marginLeft: '4' }}>
				<TextField
					id="afterWord"
					label="変換後の単語"
					sx={myStyle}
					{...register('afterWord')}
					error={!!errors.afterWord}
					helperText={errors.afterWord?.message}
				/>
			</FormControl>
			<DialogActions sx={{ justifyContent: 'end' }}>
				<Button color="warning" onClick={() => onClose()} variant="contained">
					キャンセル
				</Button>
				<Button
					type="submit"
					variant="contained"
					color="success"
					disabled={!isValid || !isDirty}
				>
					+ 追加
				</Button>
			</DialogActions>
		</form>
	);
};

export default AddModal;
