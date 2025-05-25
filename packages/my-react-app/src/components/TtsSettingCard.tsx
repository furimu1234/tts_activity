import type React from 'react';
import Loading from './Loading';
import { TtsSettingCard } from './TtsCardComponents/PreferenceCard';
import { useTtsSettingOperation } from './ttsSettingCardOperations';

// --- PreferenceCardList Component ---
export const PreferenceCardList: React.FC = () => {
	const { items, editingId, formState, startEdit, handleChange, save } =
		useTtsSettingOperation();

	if (items.length === 0) {
		return <Loading />;
	}

	return (
		<>
			<div className="text-center text-white text-lg font-semibold mt-4 mb-2">
				🔧 アイコンをタップして設定を変更できます！
				<br />
				アクティビティで聞くと自分だけこの設定のボイスで再生されます
			</div>

			<div
				className="
					grid 
					grid-cols-1 
					md:grid-cols-3    /* md 以上で3列 */
					justify-items-center  /* 各セル内を中央揃え */
					gap-4 
					max-w-screen-xl 
					mx-auto           /* グリッド全体を中央寄せ */
				"
			>
				{items.map((item) => (
					<TtsSettingCard
						key={item.ttsData.userId}
						item={item}
						isEditing={editingId === item.ttsData.userId}
						formState={formState}
						startEdit={startEdit}
						handleChange={handleChange}
						save={save}
					/>
				))}
			</div>
		</>
	);
};
