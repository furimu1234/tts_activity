import { Button, type ButtonProps } from '@mui/material';

export function DeleteButton({ ...props }: ButtonProps) {
	return (
		<Button
			{...props}
			color="error"
			variant="contained"
			sx={{ justifyContent: 'end' }}
		>
			削除
		</Button>
	);
}
