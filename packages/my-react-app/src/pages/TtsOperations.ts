import { useCallback, useEffect, useRef, useState } from 'react';
import { discordSdk } from '../actions/authActions';
import { createVoiceBlob } from '../utils/createVoiceBlob';
import './Tts.css';
import { useIsMuted } from '../contexts/muted';
import { useApi, useDialog } from '../providers';
import { authStore } from '../store/authStore';
//import { isMutedState } from '../atoms/muted';
import type { WebScoketData } from '../types';

export const useTtsOperation = (isPlay: boolean) => {
	const [messageDatas, setMessageDatas] = useState<WebScoketData[]>([]);
	const [isVc, setIsVc] = useState<boolean>(true);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const socketRef = useRef<WebSocket | null>(null);
	const { isMuted } = useIsMuted();
	const auth = authStore();
	const api = useApi();
	const { showError } = useDialog();

	const channelBlock = useCallback((channelId: string) => {
		return channelId !== discordSdk.channelId;
	}, []);

	const play = useCallback(
		async (blob: Blob, isMuted: boolean) => {
			if (isMuted) return;
			if (!isPlay) return;

			const url = URL.createObjectURL(blob);
			const audio = new Audio(url);
			audioRef.current = audio;
			await audio.play();
		},
		[isPlay],
	);

	const initializeCheck = useCallback(async () => {
		if (isPlay) {
			const error = await api.check();
			if (error) {
				showError('実行エラー', error);
				setIsVc(false);
				return false;
			}
			return true;
		}
		return true;
	}, [api, isPlay, showError]);

	useEffect(() => {
		if (!isVc) return;

		let socket: WebSocket | undefined = undefined;

		async function execute() {
			const check = await initializeCheck();

			if (!check) return;

			socket = new WebSocket(
				`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/.proxy/api/ws`,
			);
			socketRef.current = socket;

			socket.addEventListener('message', async (ev) => {
				console.log(JSON.stringify(ev))
				const data: WebScoketData = JSON.parse(ev.data);
				console.log(data)

				if (data.isSetClientId && socket) {
					socket.send(
						JSON.stringify({
							clientId: data.clientId,
							channelId: discordSdk.channelId,
						}),
					);
					return;
				}

				//サーバーでフィルターしてるけど安全性のため
				if (!channelBlock(data.channel_id)) {
					setMessageDatas((prev) => [data, ...prev]);
					setTimeout(async () => {
						console.log(data.wavDatas);
						await Promise.all(
							data.wavDatas.map(async (x) => {
								console.log(x.userId);
								if (x.userId !== auth.user.id) return;

								const blob = createVoiceBlob(x.wavData);

								await play(blob, isMuted);
							}),
						);
					}, 1000);
				}
			});
		}

		execute();

		// クリーンアップ
		return () => {
			if (socket) socket.close();

			if (audioRef.current) audioRef.current.pause();
		};
	}, [isMuted, play, channelBlock, auth, initializeCheck, isVc]);

	return { messageDatas };
};
