import { useIsMuted } from '../contexts/muted';

export const ToggleMute = () => {
	const { isMuted, setMuted } = useIsMuted();

	return (
		<button
			type="button"
			onClick={() => {
				setMuted(!isMuted);
			}}
			style={{
				padding: '8px 16px',
				fontSize: 16,
				cursor: 'pointer',
			}}
		>
			{isMuted
				? '🔇 ミュート中 (クリックで解除)'
				: '🔊 音声再生中 (クリックでミュート)'}
		</button>
	);
};
