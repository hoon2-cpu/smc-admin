/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { copyFileSync, existsSync } from 'node:fs'

/**
 * 빌드 후 dist/index.html을 dist/404.html로 복사하는 플러그인.
 * GitHub Pages(정적 호스팅)에서 /admin/* 같은 딥링크 새로고침 시
 * 404 대신 SPA(index.html)가 로드되어 BrowserRouter가 경로를 처리하게 합니다.
 */
function spa404Fallback(): Plugin {
  return {
    name: 'spa-404-fallback',
    closeBundle() {
      const index = fileURLToPath(new URL('./dist/index.html', import.meta.url))
      const notFound = fileURLToPath(new URL('./dist/404.html', import.meta.url))
      if (existsSync(index)) copyFileSync(index, notFound)
    },
  }
}

// base: 로컬 개발과 루트 도메인 배포는 '/'.
//   ⚠️ GitHub Pages 프로젝트 페이지(user.github.io/저장소/)에 배포할 때는
//   base를 '/저장소이름/' 으로 바꿔야 에셋/라우팅 경로가 맞습니다.
export default defineConfig({
  plugins: [react(), spa404Fallback()],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
