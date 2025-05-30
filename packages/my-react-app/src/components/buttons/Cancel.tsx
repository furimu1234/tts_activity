import { Button, type ButtonProps } from '@mui/material';

export function CancelButton({ ...props }: ButtonProps) {
	return (
		<Button {...props} autoFocus color={'warning'} variant="contained">
			キャンセル
		</Button>
	);
}
