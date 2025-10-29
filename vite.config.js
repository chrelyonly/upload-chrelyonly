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
  base: "/image-hosting-ui",
// 代理配置
  server: {
    port: 5173,
    // https: true,
    https: {

      cert: "./server.pem",
      key: "./server.key",
    },
    proxy: {
      '/image-hosting-api/': {
        // 代理到前端的地址的代理
        // target: "http://127.0.0.1:8090",
        target: "https://nginx-2.frp.chrelyonly.cn/image-hosting-api",
        // 是否跨域
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/image-hosting-api/, '')
      }
    }
  },
})
