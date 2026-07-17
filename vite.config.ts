import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 部署到 GitHub Pages 项目站时（npm run build:pages 会把 GH_PAGES 置 1），
  // 资源需从仓库子路径 /js-music/ 下加载；本地 dev/preview 走根路径。
  base: process.env.GH_PAGES ? (process.env.BASE_PATH || '/js-music/') : '/',
  plugins: [react()],
  server: { host: true, port: 5173 },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // 将重型音乐库拆分为独立 vendor chunk，提升缓存命中与并行加载
        manualChunks: {
          tone: ['tone'],
          vexflow: ['vexflow'],
          tonal: ['tonal'],
          midi: ['@tonejs/midi'],
          wavesurfer: ['wavesurfer.js'],
        },
      },
    },
  },
})
