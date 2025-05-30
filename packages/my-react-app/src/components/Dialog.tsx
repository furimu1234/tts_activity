import CloseIcon from '@mui/icons-material/Close';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
} from '@mui/material';
import type React from 'react';

interface ConfirmDialogProps {
	open: boolean;
	title: string;
	message: string;
	onSubmit: () => void;
}

const SubmitDialog: React.FC<ConfirmDialogProps> = ({
	open,
	title,
	message,
	onSubmit,
}) => {
	return (
		<Dialog open={open} onClose={onSubmit} maxWidth="xs" fullWidth>
			<DialogTitle sx={{ m: 0, p: 2 }}>
				{title}
				<IconButton
					aria-label="close"
					onClick={onSubmit}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent dividers>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onSubmit} color="primary" variant="contained">
					確認
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default SubmitDialog;
