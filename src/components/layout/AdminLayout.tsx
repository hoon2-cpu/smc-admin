import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import ModuleSidebar from './ModuleSidebar'
import { MODULES } from '@/app/registry'
import './AdminLayout.css'

/**
 * 플랫폼 공통 레이아웃.
 * 좌측 모듈 사이드바 + 상단 바 + 콘텐츠(Outlet) 구조이며,
 * 각 모듈 페이지는 이 레이아웃의 콘텐츠 영역에 렌더링됩니다.
 * (5단계에서 Header/Breadcrumb/Footer·반응형으로 확장)
 *
 * @returns 레이아웃 엘리먼트
 */
export default function AdminLayout() {
  const { pathname } = useLocation()
  // 현재 경로에 해당하는 모듈 제목을 상단 바에 표시
  const activeModule = MODULES.find((m) => pathname.startsWith(`/admin/${m.path}`))

  return (
    <div className="admin-layout">
      <ModuleSidebar />
      <div className="admin-main">
        <TopBar title={activeModule?.title ?? 'The SMC Admin'} notificationCount={12} />
        <main className="admin-content">
          {/* 모듈이 lazy 로딩되므로 Suspense로 감쌉니다 */}
          <Suspense fallback={<div className="admin-loading">불러오는 중…</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
