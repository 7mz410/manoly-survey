import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site under /manoly-survey/.
export default defineConfig({
  base: '/manoly-survey/',
  publicDir: '../public',
  plugins: [react()],
  // Skip the parent project's Tailwind postcss config.
  css: {postcss: {}},
  server: {fs: {allow: ['..']}},
});
