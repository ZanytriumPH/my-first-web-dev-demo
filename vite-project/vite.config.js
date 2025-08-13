import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { // 配置开发服务器
    proxy: {  // 配置服务器代理，解决跨域问题或简化 API 请求路径
      '/api': { // 将所有以 /api 开头的请求代理到目标服务器
        target: 'http://localhost:7001', // 目标服务器地址
        changeOrigin: true, // 是否改变请求源
      }
    }
  }
})
