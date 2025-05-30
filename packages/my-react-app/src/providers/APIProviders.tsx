import type React from 'react';
import { createContext, useContext } from 'react';
import { discordSdk } from '../actions/authActions';

interface ApiContextType {
	check: () => Promise<string | undefined>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
	const context = useContext(ApiContext);
	if (!context) {
		throw new Error('useApiはApiProviderで使う必要があります');
	}
	return context;
};

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	/**エラーダイアログを開く */
	const check = async () => {
		const channelId = discordSdk.channelId;

		const response = await fetch(`.proxy/botapi/check?channelId=${channelId}`, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		console.log('response', response);

		switch (response.status) {
			case 200:
				return undefined;
			case 500:
				return await response.text();
			case 404:
				return await response.json();
		}
	};

	return (
		<ApiContext.Provider value={{ check }}>{children}</ApiContext.Provider>
	);
};
