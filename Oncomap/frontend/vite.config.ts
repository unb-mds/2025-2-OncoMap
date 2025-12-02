import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,           // Permite usar describe, it, expect sem importar (igual ao Jest)
    environment: 'jsdom',    // Simula o navegador para os componentes React
    setupFiles: './src/setupTests.ts', // Arquivo onde importamos o jest-dom
    css: true,               // (Opcional) Processa CSS nos testes, útil se usar módulos CSS
  },
})