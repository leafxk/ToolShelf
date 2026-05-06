import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',  // GitHub Pages 需要相对路径
  build: {
    outDir: 'dist',
  },
})
