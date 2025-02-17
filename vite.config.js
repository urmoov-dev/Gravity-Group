import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5173,
    strictPort: false
  },
  build: {
    target: 'esnext',
    minify: 'esbuild'
  },
  ssr: {
    noExternal: ['three', 'apexcharts', 'chart.js', 'firebase']
  },
  optimizeDeps: {
    include: ['firebase/auth', 'firebase/app'],
    exclude: ['@sveltejs/kit']
  }
});
