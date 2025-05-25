import { MessageBox, ToggleMute } from '../components';
import './Tts.css';
import { useTtsOperation } from './TtsOperations';

export default function Tts() {
	const { messageDatas } = useTtsOperation(false);

	return (
		<div style={{ padding: 32 }}>
			<ToggleMute />

			<div className="message-box-container">
				{messageDatas.map((messageData) => {
					return (
						<>
							<MessageBox
								key={messageData.author_id}
								author_avatar_url={messageData.author_avatar_url}
								author_name={messageData.author_name}
								message={messageData.message}
							/>
						</>
					);
				})}
			</div>
		</div>
	);
}
