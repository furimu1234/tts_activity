import './MessageBox.css'; // Make sure to create the corresponding CSS file

interface MessageBoxProp {
	author_avatar_url: string;
	message: string;
	author_name: string;
}

export const MessageBox = ({
	author_avatar_url,
	message,
	author_name,
}: MessageBoxProp) => {
	return (
		<div className="message-box">
			<img src={author_avatar_url} alt="Avatar" className="avatar" />
			<div className="message-content">
				<span className="username">{author_name}</span>
				<span className="message">{message}</span>
			</div>
		</div>
	);
};
