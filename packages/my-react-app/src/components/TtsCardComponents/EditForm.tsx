import { emotionToJpRecord, speakerToJpRecord } from '@tts/serverschema';
import type { TtsData } from '../props';
import { SelectMenu } from '../selectMenu';

// --- Edit Form Component ---
export const TtsSettingEditForm: React.FC<{
	formState: TtsData;
	handleChange: (field: keyof TtsData, value: string | number) => void;
	save: () => void;
}> = ({ formState, handleChange, save }) => {
	return (
		<div className="flex flex-col gap-6 text-white">
			<div>
				<SelectMenu
					id="edit_speakers"
					label="話者"
					field="speaker"
					value={formState.speaker}
					options={speakerToJpRecord}
					handleChange={handleChange}
				/>
				{formState.speaker !== 'show' ? (
					<>
						<SelectMenu
							id="edit_emotions"
							label="感情"
							field="emotion"
							value={formState.emotion}
							options={emotionToJpRecord}
							handleChange={handleChange}
						/>
						<div key={'emotion_level'}>
							<label className="block text-sm" htmlFor={'emotion_level'}>
								感情レベル：{formState.emotionLevel}
							</label>
							<input
								id={'emotion_level'}
								type="range"
								min={1}
								max={4}
								value={formState.emotionLevel}
								onChange={(e) =>
									handleChange('emotionLevel', Number(e.target.value))
								}
								className="w-full"
							/>
						</div>
					</>
				) : (
					<></>
				)}
			</div>

			{(['pitch', 'speed'] as const).map((field) => (
				<div key={field}>
					<label className="block text-sm" htmlFor={field}>
						{field === 'pitch' ? 'ピッチ' : 'スピード'}：{formState[field]}
					</label>
					<input
						id={field}
						type="range"
						min={1}
						max={200}
						value={formState[field] as number}
						onChange={(e) => handleChange(field, Number(e.target.value))}
						className="w-full"
					/>
				</div>
			))}

			<button
				type="submit"
				onClick={save}
				className="px-4 py-2 bg-blue-500 text-white rounded"
			>
				更新
			</button>
		</div>
	);
};
