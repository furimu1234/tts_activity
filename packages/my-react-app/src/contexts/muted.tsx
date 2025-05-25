import { type ReactNode, createContext, useContext, useState } from 'react';

type isMutedProps = {
	isMuted: boolean;
	setMuted: (val: boolean) => void;
};

const isMutedContext = createContext<isMutedProps | undefined>(undefined);

export const IsMutedProvider = ({ children }: { children: ReactNode }) => {
	const [isMuted, setMuted] = useState(false);

	return (
		<isMutedContext.Provider value={{ isMuted, setMuted }}>
			{children}
		</isMutedContext.Provider>
	);
};

export const useIsMuted = () => {
	const ctx = useContext(isMutedContext);
	if (!ctx)
		throw new Error('useUserSettings must be used inside UserSettingsProvider');
	return ctx;
};
