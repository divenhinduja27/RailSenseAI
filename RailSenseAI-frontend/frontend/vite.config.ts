import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
  plugins: [react()],
  // 🚀 This defines 'global' as 'window' to fix the sockjs-client error
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      // This tells Vite that @ refers to the src folder
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/v1/rail-intelligence': {
        target: 'http://localhost:8080', 
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/ai-intelligence': {
        target: 'http://localhost:8080', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
});