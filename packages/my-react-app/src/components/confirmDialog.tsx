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
	onConfirm: () => void;
	onCancel: () => void;
	confirmText?: string;
	cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	open,
	title,
	message,
	onConfirm,
	onCancel,
	confirmText = 'OK',
	cancelText = 'キャンセル',
}) => {
	return (
		<Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
			<DialogTitle sx={{ m: 0, p: 2 }}>
				{title}
				<IconButton
					aria-label="close"
					onClick={onCancel}
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
				<Button onClick={onCancel} color="inherit">
					{cancelText}
				</Button>
				<Button onClick={onConfirm} color="primary" variant="contained">
					{confirmText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;
