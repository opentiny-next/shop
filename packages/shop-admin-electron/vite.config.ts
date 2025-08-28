import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  // 添加 base 配置以支持 Electron 环境
  base: '/shop-admin/',
  plugins: [vue()],
  server: {
    hmr: {
      overlay: true
    },
    port: 3060,
    open: false, // 禁止自动打开浏览器，因为用户可以选择启动方式
    host: true
  }
})
