import { useCallback, useEffect, useRef, useState } from 'react';
import { discordSdk } from '../discord';
import { createVoiceBlob } from '../utils/createVoiceBlob';
import './Tts.css';
import { useIsMuted } from '../contexts/muted';
//import { isMutedState } from '../atoms/muted';
import type { WebScoketData } from '../types';

export const useTtsOperation = (isPlay: boolean) => {
	const [messageDatas, setMessageDatas] = useState<WebScoketData[]>([]);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const socketRef = useRef<WebSocket | null>(null);
	const { isMuted } = useIsMuted();

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

	useEffect(() => {
		// 2) WebSocket 接続
		const socket = new WebSocket(
			`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/.proxy/api/ws`,
		);
		socketRef.current = socket;
		console.log('再接続');

		socket.addEventListener('message', async (ev) => {
			const data: WebScoketData = JSON.parse(ev.data);

			if (data.isSetClientId) {
				console.log('接続');
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

				const blob = createVoiceBlob(data.wavData);

				setTimeout(async () => {
					await play(blob, isMuted);
				}, 1000);
			}
		});

		// クリーンアップ
		return () => {
			socket.close();
			if (audioRef.current) audioRef.current.pause();
		};
	}, [isMuted, play, channelBlock]);

	return { messageDatas };
};
