import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import adminPlugin from './vite-plugin-admin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), adminPlugin()],
  // 나중에(lazy) 불러오는 라이브러리를 미리 등록 — 개발 서버가 처음 불러올 때 페이지를 새로고침해서
  // 작성 중인 글이 날아가는 것을 막음
  optimizeDeps: { include: ['pdfjs-dist', 'react-markdown', 'remark-gfm'] },
})
