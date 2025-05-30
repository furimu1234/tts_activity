import TableView from '../components/Table';
import { useDictionariesOperation } from './DictionariesOperation';
import './Tts.css';

export default function Dictionaries() {
	const {
		items,
		toggleEnable,
		isEditable,
		editDictionary,
		addDictionary,
		isEnable,
		setIsEnable,
	} = useDictionariesOperation();

	return (
		<TableView
			list={items.sort((a, b) => b.id - a.id)}
			columns={[
				{
					name: '適用範囲',
					datas: (x) => (x.parentId === 'global' ? '全体' : '自分のみ'),
				},
				{
					name: '置換前単語',
					datas: (x) => x.beforeWord,
				},
				{
					name: '置換後単語',
					datas: (x) => x.afterWord,
				},
			]}
			isEditable={(x) => isEditable(x)}
			toggleEnable={toggleEnable}
			onEdit={editDictionary}
			onAdd={addDictionary}
			ignoreDisable={isEnable}
			setIsEnable={setIsEnable}
		/>
	);
}
