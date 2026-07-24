import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from '@/App'
import '@/styles/reset.css'
import '@/styles/global.css'

// HashRouter 사용 이유: GitHub Pages(정적 호스팅)에서 새로고침 시 404가
// 나지 않도록 하기 위함 (URL이 /#/admin 형태가 됩니다).
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('루트 엘리먼트(#root)를 찾을 수 없습니다.')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
