import * as React from 'react';
import { start } from '../actions/authActions';
import { authStore } from '../store/authStore';
import Loading from './Loading';

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const auth = authStore();

	React.useEffect(() => {
		start();
	}, []);

	if (auth.user == null) {
		return <Loading />;
	}

	return <>{children}</>;
}
