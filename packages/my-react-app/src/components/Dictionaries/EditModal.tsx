import { zodResolver } from '@hookform/resolvers/zod';
import {
	Box,
	DialogActions,
	DialogTitle,
	FormControl,
	TextField,
} from '@mui/material';
import type { DictionaryResponseSchema } from '@tts/serverschema';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CancelButton, ConfirmButton } from '../buttons';

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

interface EditModalProps {
	onClose: () => void;
	onEdit: (item: DictionaryResponseSchema) => void;
	item: DictionaryResponseSchema;
}

const editSchema = z.object({
	afterWord: z
		.string()
		.min(3, '3文字以上で入力してください')
		.max(50, '50文字以内で入力してください'),
});

type EditSchema = z.infer<typeof editSchema>;

const EditModal = ({ onEdit, onClose, item }: EditModalProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isDirty },
	} = useForm<EditSchema>({
		mode: 'onChange',
		resolver: zodResolver(editSchema),
		defaultValues: item,
	});

	function onSubmit(data: EditSchema) {
		onEdit({
			...item,
			afterWord: data.afterWord,
		});
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<DialogTitle color="white" sx={{ justifyContent: 'start' }}>
				{item.beforeWord}編集画面
			</DialogTitle>

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
			<Box>
				<DialogActions sx={{ justifyContent: 'end' }}>
					<CancelButton onClick={() => onClose()} />
					<ConfirmButton
						color="success"
						disabled={!isValid || !isDirty}
						onClick={() => {
							onEdit(item);
						}}
					/>
				</DialogActions>
			</Box>
		</form>
	);
};

export default EditModal;
