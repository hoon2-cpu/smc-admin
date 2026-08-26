import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import ModuleSidebar from './ModuleSidebar'
import { MODULES } from '@/app/registry'
import './AdminLayout.css'

/**
 * 플랫폼 공통 레이아웃.
 * 좌측 모듈 사이드바 + 상단 바 + 콘텐츠(Outlet) 구조.
 * 데스크톱은 사이드바 고정, 모바일(≤768px)은 햄버거로 여닫는 드로어로 동작합니다.
 *
 * @returns 레이아웃 엘리먼트
 */
export default function AdminLayout() {
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // 현재 경로에 해당하는 모듈 제목을 상단 바에 표시
  const activeModule = MODULES.find((m) => pathname.startsWith(`/admin/${m.path}`))

  // 경로가 바뀌면(메뉴 이동) 모바일 드로어는 닫습니다.
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  return (
    <div className="admin-layout">
      <ModuleSidebar open={drawerOpen} onNavigate={() => setDrawerOpen(false)} />

      {/* 모바일 드로어 열림 시 뒤 배경(탭하면 닫힘) */}
      {drawerOpen && <div className="admin-overlay" onClick={() => setDrawerOpen(false)} />}

      <div className="admin-main">
        <TopBar
          title={activeModule?.title ?? 'The SMC Admin'}
          notificationCount={12}
          onMenuClick={() => setDrawerOpen((prev) => !prev)}
        />
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
