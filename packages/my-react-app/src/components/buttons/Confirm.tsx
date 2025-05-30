import { Button, type ButtonProps } from '@mui/material';

export function ConfirmButton({ ...props }: ButtonProps) {
	return (
		<Button {...props} autoFocus variant="contained">
			確認
		</Button>
	);
}
