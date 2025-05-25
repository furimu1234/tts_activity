import type { CardData, TtsData } from '../props';
import { TtsSettingCardDisplay } from './Display';
import { TtsSettingEditForm } from './EditForm';

// --- PreferenceCard Component ---
interface PreferenceCardProps {
	item: CardData;
	isEditing: boolean;
	formState: TtsData;
	startEdit: (item: CardData) => void;
	handleChange: (field: keyof TtsData, value: string | number) => void;
	save: () => void;
}

// --- PreferenceCard Component ---
export const TtsSettingCard: React.FC<PreferenceCardProps> = ({
	item,
	isEditing,
	formState,
	startEdit,
	handleChange,
	save,
}) => {
	return (
		<div
			className="
            w-64                /* 幅は固定 */
            bg-[#2d2d2d] 
            rounded-lg 
            shadow 
            flex 
            flex-col 
            items-center      /* 中央揃え */
            space-y-4         /* 子要素の間に 1rem (16px) の縦スペース */
            mt-3
            pt-3
            pb-3
            "
		>
			<img
				src={item.userInfo.memberAvatarUrl}
				alt={item.userInfo.memberDisplayName}
				className="
                w-24 h-24         /* アイコンも大きめ */
                rounded-full 
                object-cover 
                cursor-pointer
                mb-2             /* 下に余白を追加 */
                "
				onClick={() => startEdit(item)}
				onKeyDown={() => {}}
			/>

			<h3 className="text-xl font-semibold text-white text-center mt-5">
				{item.userInfo.memberDisplayName}
			</h3>

			<hr className="border-gray-600 w-full" />

			{isEditing ? (
				<TtsSettingEditForm
					formState={formState}
					handleChange={handleChange}
					save={save}
				/>
			) : (
				<TtsSettingCardDisplay item={item.ttsData} />
			)}
		</div>
	);
};
