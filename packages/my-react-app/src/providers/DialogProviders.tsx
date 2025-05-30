import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { CancelButton, ConfirmButton } from '../components/buttons';
import { DeleteButton } from '../components/buttons/Delete';

type buttonColorType = 'primary' | 'warning' | 'info' | 'success' | 'error';

interface confirmProps {
	title: string;
	message: string;
	color: buttonColorType;
	onSubmit?: () => void;
}
interface modalProps {
	onClose: () => void;
	children: React.ReactNode;
	onDelete?: () => void;
}

interface DialogContextType {
	onDlgClose: () => void;
	showError: (title: string, message: string, bgColor?: string) => void;
	showInfo: (title: string, message: string) => void;
	showModal: (options: modalProps) => void;
	showConfirm: (options: confirmProps) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
	const context = useContext(DialogContext);
	if (!context) {
		throw new Error('useDialog must be used within a DialogProvider');
	}
	return context;
};

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [message, setMessage] = useState('');
	const [color, setColor] = useState<buttonColorType>('primary');
	const [bgColor, setBgColor] = useState<string>('bg-[#2d2d2d]');
	const [isModal, setIsModal] = useState<boolean>(false);
	const [confirmResolver, setConfirmResolver] = useState<
		((result: boolean) => void) | null
	>(null);

	const [modalCloseCallback, setModalCloseCallback] = useState<
		(() => void) | undefined
	>(undefined);
	const [modalDeleteCallback, setModalDeleteCallback] = useState<
		(() => void) | undefined
	>(undefined);

	const [modalChildren, setModalChildren] = useState<
		React.ReactNode | undefined
	>(undefined);

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	/**ダイアログを閉じる */
	const onDlgClose = () => {
		setOpen(false);
	};

	/**エラーダイアログを開く */
	const showError = (
		newTitle: string,
		newMessage: string,
		bgColor?: string,
	) => {
		console.log('showerror');
		setTitle(newTitle);
		setMessage(newMessage);
		setOpen(true);
		setColor('error');
		if (bgColor) setBgColor(bgColor);
	};
	/**情報ダイアログを開く */
	const showInfo = (newTitle: string, newMessage: string) => {
		console.log('showinfo');
		setTitle(newTitle);
		setMessage(newMessage);
		setOpen(true);
		setColor('info');
	};

	/**確認ダイアログを開く */
	const showConfirm = (options: confirmProps): Promise<boolean> => {
		console.log('showconfirm');
		setIsModal(false);
		setTitle(options.title);
		setMessage(options.message);
		setOpen(true);
		setColor('primary');

		return new Promise<boolean>((resolve) => {
			setConfirmResolver(() => resolve);
		});
	};
	/**モーダルを開く */
	const showModal = (options: modalProps) => {
		setOpen(true);
		setIsModal(true);
		setModalChildren(options.children);
		setModalCloseCallback(options.onClose);

		function handleDelete() {
			console.log('handle delete');
			if (options.onDelete) options.onDelete();
		}

		setModalDeleteCallback(handleDelete);
	};

	/**モーダルがクローズされたとき */
	function handleModalClose() {
		if (modalCloseCallback) modalCloseCallback();
		setOpen(false);
	}
	console.log('before View isUndefined: ', modalDeleteCallback === undefined);

	return (
		<DialogContext.Provider
			value={{ onDlgClose, showError, showInfo, showModal, showConfirm }}
		>
			{children}

			{isModal && (
				<Dialog
					open={open}
					onClose={handleModalClose}
					className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 w-auto"
				>
					<DialogContent className="bg-[#2d2d2d]">
						<DialogActions
							sx={{
								justifyContent: 'space-between',
								padding: 2,
								alignItems: 'center',
							}}
						>
							<Button
								className="absolute right-3"
								onClick={handleModalClose}
								variant="outlined"
								color="error"
							>
								✕
							</Button>
							{modalDeleteCallback && (
								<DeleteButton onClick={modalDeleteCallback} />
							)}
						</DialogActions>

						{modalChildren}
					</DialogContent>
				</Dialog>
			)}

			{/**modal以外の場合はデフォルトでフッターにボタン */}
			{!isModal && (
				<Dialog
					open={open}
					onClose={() => setOpen(false)}
					fullScreen={fullScreen}
					className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 w-auto"
				>
					<DialogTitle className={`${bgColor} text-white`}>{title}</DialogTitle>
					<DialogContent className={`${bgColor}`}>
						<DialogContentText sx={{ color: 'white' }}>
							{message}
						</DialogContentText>
					</DialogContent>
					<DialogActions className={`${bgColor}`}>
						<Box display="flex" justifyContent="end" alignItems="end">
							{confirmResolver && (
								<CancelButton
									onClick={() => {
										setOpen(false);
										if (confirmResolver) confirmResolver(false);
										setConfirmResolver(null);
									}}
								/>
							)}
						</Box>

						<ConfirmButton
							color={color}
							onClick={() => {
								if (confirmResolver) confirmResolver(true);
								setOpen(false);
								setConfirmResolver(null);
							}}
						/>
					</DialogActions>
				</Dialog>
			)}
		</DialogContext.Provider>
	);
};
