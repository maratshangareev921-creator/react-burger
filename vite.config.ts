import react from '@vitejs/plugin-react';
import readableClassnames from 'vite-plugin-readable-classnames';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    readableClassnames(),
    sassDts({
      enabledMode: ['development'],
      esmExport: true,
    }),
    tsconfigPaths(),
  ],
  base: command === 'build' ? '/react-burger/' : '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
    passWithNoTests: true,
  },
  server: {
    open: false,
    proxy: {
      '/api': {
        target: 'https://new-stellarburgers.education-services.ru',
        changeOrigin: true,
        secure: false,
		rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
}));
