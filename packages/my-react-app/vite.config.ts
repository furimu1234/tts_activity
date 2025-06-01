import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '../../', '');

	return {
		plugins: [react(), tailwindcss()],
		envDir: '../../',
		server: {
			port: Number.parseInt(env.WEBAPP_SERVE_PORT),
			allowedHosts: true,
			host: "0.0.0.0",
			proxy: {
				'/api': {
					target: 'http://localhost:8787/api',
					changeOrigin: true,
					secure: false,
					ws: true,
				},
				'/botapi': {
					target: 'http://localhost:9000/botapi',
					changeOrigin: true,
					secure: false,
					ws: false,
				},
			},
		},
	};
});
