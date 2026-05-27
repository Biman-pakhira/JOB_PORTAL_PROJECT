import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — rarely changes, long browser cache life
          'vendor-react': ['react', 'react-dom'],
          // React Router — separate from react core
          'vendor-router': ['react-router-dom'],
          // xlsx is heavy (~280KB); isolated so non-admin pages never load it
          'vendor-xlsx': ['xlsx'],
        },
      },
    },
  },
});
