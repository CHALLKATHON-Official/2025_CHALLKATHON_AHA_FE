// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 모든 요청을 프록시 처리합니다.
      '/api': {
        // 실제 백엔드 서버 주소를 적어줍니다.
        target: 'http://localhost:8080',
        // 출처(Origin) 헤더를 변경하여 CORS 문제를 해결합니다.
        changeOrigin: true,
      }
    }
  }
})