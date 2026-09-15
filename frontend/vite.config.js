import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5004,
    proxy: {
      // Browser requests remain same-origin as the React app: /api/sections,
      // /api/staff, etc.  Vite strips /api and relays them to FastAPI, so the
      // UI does not need to know the backend host or manage CORS in dev mode.
      '/api': {
        target: 'http://127.0.0.1:5003',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
