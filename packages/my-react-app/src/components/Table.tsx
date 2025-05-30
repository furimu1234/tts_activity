import './Table.css';

import AddIcon from '@mui/icons-material/Add';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
	Button,
	FormControlLabel,
	IconButton,
	Paper,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from '@mui/material';
import type {
	AddDictionaryRequestSchema,
	DictionaryResponseSchema,
} from '@tts/serverschema';
import type React from 'react';
import { type Dispatch, useState } from 'react';
import { useDialog } from '../providers';
import AddModal from './Dictionaries/AddModal';
import EditModal from './Dictionaries/EditModal';

interface ColumnProps<T extends DictionaryResponseSchema> {
	name: string;
	datas: (a: T) => string | React.ReactNode;
	onClick?: (item: T) => void;
	bgColor?: (item: T) => string;
}

interface TableProps<T extends DictionaryResponseSchema> {
	list: T[];
	columns: ColumnProps<T>[];
	toggleEnable: (dictionaryId: number) => Promise<void>;
	onEdit?: (item: DictionaryResponseSchema) => void;
	onAdd: (item: AddDictionaryRequestSchema) => void;
	isEditable: (item: T) => boolean;
	ignoreDisable: boolean;
	setIsEnable: Dispatch<React.SetStateAction<boolean>>;
}

const TableView = <T extends DictionaryResponseSchema>({
	list,
	columns,
	toggleEnable,
	onEdit,
	onAdd,
	isEditable,
	ignoreDisable,
	setIsEnable,
}: TableProps<T>) => {
	const { onDlgClose, showError, showModal } = useDialog();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [editing, setEditing] = useState(false);

	const handleEditClick = (item: T) => {
		if (onEdit)
			showModal({
				onClose: () => {},
				children: (
					<EditModal
						item={item}
						onClose={onDlgClose}
						onEdit={(x) => onEdit(x)}
					/>
				),
			});
	};

	const handleToggleEnableCol = async (item: T) => {
		if (toggleEnable) {
			setEditing(true);
			await toggleEnable(item.id);
			setEditing(false);
		}
	};

	const selectButtonColumn: ColumnProps<T> = {
		name: '編集',
		datas: (x) => (
			<IconButton
				onClick={() => {
					isEditable(x)
						? handleEditClick(x)
						: showError(
								'編集エラー',
								'全体適用の辞書は自分が作成した辞書のみ編集出来ます。',
							);
				}}
				sx={
					isEditable(x)
						? {
								'&:hover': {
									color: 'success.main',
									backgroundColor: 'rgba(27, 236, 114, 0.61)',
								},
							}
						: undefined
				}
			>
				<BorderColorIcon
					sx={{ color: isEditable(x) ? 'rgba(13, 247, 110, 0.9)' : undefined }}
				/>
			</IconButton>
		),
	};

	const deleteButtonColumn: ColumnProps<T> = {
		name: '有効',
		datas: (x) => (
			<IconButton
				disabled={editing}
				onClick={() => handleToggleEnableCol(x)}
				sx={
					isEditable(x)
						? {
								'&:hover': {
									color: 'error.main',
									backgroundColor: 'rgba(255, 0, 0, 0.1)', // 薄い赤
								},
							}
						: undefined
				}
			>
				{editing && <RestartAltIcon />}

				{!editing && x.enable && <CheckIcon color="inherit" />}
				{!editing && x.enable === false && (
					<CheckBoxOutlineBlankIcon color="inherit" />
				)}
			</IconButton>
		),
	};

	const fixedButtonColumns = [
		selectButtonColumn,
		deleteButtonColumn,
		...columns,
	];

	function getBgColor(isEditable: boolean) {
		return isEditable ? '#6B7280' : '#1f2937';
	}

	const handleChangePage = (_, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<>
			<Paper
				sx={{
					width: '100%',
					overflow: 'hidden',
					height: '100%',
					padding: '3%',
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
					}}
				>
					<FormControlLabel
						control={
							<Switch
								checked={ignoreDisable}
								onChange={() => setIsEnable((prev) => !prev)}
							/>
						}
						label="無効化を表示"
					/>

					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							showModal({
								onClose: () => {},
								children: (
									<AddModal onClose={onDlgClose} onAdd={(x) => onAdd(x)} />
								),
							});
						}}
						startIcon={<AddIcon />}
					>
						追加
					</Button>
				</div>
				<TableContainer sx={{ maxHeight: 500 }}>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								{fixedButtonColumns.map((col, i) => (
									<TableCell
										style={{
											backgroundColor: 'black',
											color: 'white',
										}}
										key={i.toString()}
									>
										{col.name}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{list
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((item, rowIndex) => (
									<TableRow hover key={rowIndex.toString()}>
										{fixedButtonColumns.map((col, colIndex) => {
											return (
												<TableCell
													key={colIndex.toString()}
													style={{
														background: getBgColor(isEditable(item)),
														color: 'white',
														maxWidth: 30,
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														whiteSpace: 'nowrap',
													}}
													onClick={() =>
														col.onClick ? col.onClick(item) : undefined
													}
												>
													{col.datas(item)}
												</TableCell>
											);
										})}
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[10, 25, 100]}
					component="div"
					count={fixedButtonColumns.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</>
	);
};

export default TableView;
