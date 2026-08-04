import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '@/App'
import '@/styles/reset.css'
import '@/styles/global.css'

// BrowserRouter로 # 없는 깔끔한 경로(/admin/...)를 사용합니다.
// GitHub Pages 새로고침 404는 dist/404.html(SPA 폴백)으로 대응합니다.
// basename은 배포 base 경로에 맞춰 자동 설정(루트면 빈 값).
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('루트 엘리먼트(#root)를 찾을 수 없습니다.')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter basename={routerBasename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
