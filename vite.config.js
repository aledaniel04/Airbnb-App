import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    outDir: 'dist', // Carpeta donde se guarda el build
  },
  // Configuración para redirigir rutas a index.html
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
