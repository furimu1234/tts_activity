import * as React from 'react';
import type { JSX } from 'react';
import {
	Link,
	Route,
	BrowserRouter as Router,
	Routes,
	useLocation,
	useNavigate,
} from 'react-router-dom';
import * as S from './AppStyles';
import { discordSdk } from './actions/authActions';
import { AuthProvider } from './components/AuthProvider';
import DesignSystemProvider from './components/DesignSystemProvider';
import * as Scrollable from './components/Scrollable';
import { IsMutedProvider } from './contexts/muted';
import Dictionaries from './pages/Dictionaries';
import HelpPage from './pages/Help';
import Tts from './pages/Tts';
import { useTtsOperation } from './pages/TtsOperations';
import TtsSetting from './pages/TtsSetting';
import { DialogProvider } from './providers';
import { ApiProvider } from './providers/APIProviders';

process.on('uncaughtException', (err) => {
	console.error('💥 uncaughtException:', err);
	// プロセスを止めない
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('💥 unhandledRejection:', reason);
});

export default function App(): React.ReactElement {
	return (
		<DialogProvider>
			<DesignSystemProvider>
				<IsMutedProvider>
					<AuthProvider>
						<ApiProvider>
							<Router>
								<RootedApp />
							</Router>
						</ApiProvider>
					</AuthProvider>
				</IsMutedProvider>
			</DesignSystemProvider>
		</DialogProvider>
	);
}

interface AppRoute {
	path: string;
	name: string;
	component: () => JSX.Element;
}

const routes: Record<string, AppRoute> = {
	help: {
		path: '/help',
		name: '使い方・ヘルプ',
		component: HelpPage,
	},
	tts: {
		path: '/tts',
		name: '読み上げ',
		component: Tts,
	},
	ttsSetting: {
		path: '/ttsSetting',
		name: '読み上げ設定',
		component: TtsSetting,
	},
	dictionaries: {
		path: '/dictionaries',
		name: '辞書設定',
		component: Dictionaries,
	},
};

let navigateOnInit = true;

function RootedApp(): React.ReactElement {
	const location = useLocation();
	const navigate = useNavigate();
	useTtsOperation(true);

	React.useEffect(() => {
		if (navigateOnInit === false || typeof discordSdk.customId !== 'string') {
			return;
		}

		if (
			Object.prototype.hasOwnProperty.call(routes, discordSdk.customId) &&
			'path' in routes[discordSdk.customId]
		) {
			navigate(routes[discordSdk.customId].path);
			navigateOnInit = false;
		} else {
			navigateOnInit = false;
			navigate('/help');
		}
	}, [navigate]);

	return (
		<S.SiteWrapper>
			<Scrollable.Root
				css={{
					border: '1px solid black',
					height: '100%',
					width: '200px',
					'@small': { height: '200px', width: '100%' },
					'@xsmall': { height: 0, width: '100%' },
				}}
			>
				<Scrollable.Viewport>
					<S.Ul>
						{Object.values(routes).map((r) => (
							<S.Li
								as={Link}
								to={r.path}
								key={r.path}
								selected={location.pathname === r.path}
							>
								<p>{r.name}</p>
							</S.Li>
						))}
					</S.Ul>
				</Scrollable.Viewport>
				<Scrollable.Scrollbar orientation="vertical">
					<Scrollable.Thumb />
				</Scrollable.Scrollbar>
			</Scrollable.Root>
			<Scrollable.Root css={{ flex: 1 }}>
				<Scrollable.Viewport css={{ width: '100%' }}>
					<Routes>
						{Object.values(routes).map((r) => (
							<Route key={r.path} path={r.path} element={<r.component />} />
						))}
					</Routes>
				</Scrollable.Viewport>
				<Scrollable.Scrollbar orientation="vertical">
					<Scrollable.Thumb />
				</Scrollable.Scrollbar>
			</Scrollable.Root>
		</S.SiteWrapper>
	);
}
