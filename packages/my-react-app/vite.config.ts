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
			proxy: {
				'/api': {
					target: 'http://localhost:8787',
					changeOrigin: true,
					secure: false,
					ws: true,
				},
			},
		},
	};
});
