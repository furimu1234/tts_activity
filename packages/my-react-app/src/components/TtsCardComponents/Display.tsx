import { emotionToJp, speakerToJp } from '../../utils';
import type { TtsData } from '../props';

// --- Display Component ---
export const TtsSettingCardDisplay: React.FC<{ item: TtsData }> = ({
	item,
}) => (
	<div className="space-y-2 text-sm text-white text-center">
		<p className="py-1">話者：{speakerToJp(item.speaker)}</p>

		{item.speaker !== 'show' && (
			<>
				<p className="py-1">感情：{emotionToJp(item.emotion)}</p>
				<p className="py-1">感情レベル：{item.emotionLevel}</p>
			</>
		)}

		<p className="py-1">ピッチ：{item.pitch}</p>
		<p className="py-1">スピード：{item.speed}</p>
	</div>
);
