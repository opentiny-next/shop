import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import electronRenderer from 'vite-plugin-electron-renderer'
// https://vitejs.dev/config/
export default defineConfig({
  // 添加 base 配置以支持 Electron 环境
  base: './',
  plugins: [
    vue(),
    electron({
      entry: 'main/index.ts',
      vite: {
        build: {
          outDir: 'dist-electron',
          rollupOptions: {
            output: {
              format: 'es'
            }
          }
        }
      }
    }),
    electronRenderer()
  ],
  server: {
    hmr: {
      overlay: true
    },
    port: 3060,
    open: false, // 禁止自动打开浏览器，因为用户可以选择启动方式
    host: true,
    proxy: {
      // 代理 /agent 开头的请求到本地 8001 端口（AI Agent 服务）
      '/agent': {
        target: 'https://ai.opentiny.design',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/agent/, '')
      }
    }
  }
})
