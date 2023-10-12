import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
// 代理配置
  server: {
    port: 5173,
    // https: true,
    https: {

      cert: "./server.pem",
      key: "./server.key",
    },
    proxy: {
      '/api/': {
        // 代理到前端的地址的代理
        target: "https://temp-img.chrelyonly.cn/api",
        // 是否跨域
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})
