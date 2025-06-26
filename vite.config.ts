import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 기존 API 프록시 규칙
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      // ✨ '/images' 경로에 대한 프록시 규칙 추가
      "/images": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
