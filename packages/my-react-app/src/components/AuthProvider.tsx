import * as React from 'react';
import { start } from '../actions/authActions';
import { useDialog } from '../providers';
import { authStore } from '../store/authStore';
import Loading from './Loading';

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const auth = authStore();
	const [timeoutTriggered, setTimeoutTriggered] = React.useState(false);
	const timerRef = React.useRef<NodeJS.Timeout | null>(null);
	const { showError } = useDialog();

	React.useEffect(() => {
		start();
	}, []);

	React.useEffect(() => {
		if (auth.user === null && !timeoutTriggered) {
			// タイマーを開始
			timerRef.current = setTimeout(() => {
				setTimeoutTriggered(true);
				return showError(
					'認証失敗',
					'認証に失敗しました。discordの制限によりアクセスが制限されてます。少し時間をおいて起動しなおしてみてください。',
				);
			}, 15000);
		} else if (auth.user && timerRef.current) {
			// user が設定されたらタイマーをクリア
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, [auth.user, timeoutTriggered, showError]);

	if (auth.user == null) {
		return <Loading />;
	}

	return <>{children}</>;
}
