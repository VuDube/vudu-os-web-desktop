import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  root: '.',
  build: {
    outDir: 'dist', // Cloudflare Pages will serve from this folder
    emptyOutDir: true
  },
  resolve: {
    alias: {
      $lib: '/src/lib'
    }
  },
  server: {
    port: 5173
  }
});