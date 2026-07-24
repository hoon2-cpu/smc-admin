import type { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import TopBar from './TopBar'
import './AppShell.css'

/** {@link AppShell} 컴포넌트 props. */
interface AppShellProps {
  /** 상단 바에 표시할 페이지 제목. */
  title: string
  /** 상단 바 알림 개수. */
  notificationCount?: number
  /** 콘텐츠 영역에 렌더링할 페이지 본문. */
  children: ReactNode
}

/**
 * 관리자 화면 공통 레이아웃 골격.
 * 좌측 고정 사이드바 + (상단 바 + 스크롤되는 콘텐츠) 구조를 제공합니다.
 *
 * @param props - {@link AppShellProps}
 * @returns 레이아웃 엘리먼트
 */
export default function AppShell({ title, notificationCount, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <AdminSidebar />
      <div className="app-main">
        <TopBar title={title} notificationCount={notificationCount} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  )
}
