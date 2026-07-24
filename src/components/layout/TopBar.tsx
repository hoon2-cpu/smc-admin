import { Bell, User } from 'lucide-react'
import './TopBar.css'

/** {@link TopBar} 컴포넌트 props. */
interface TopBarProps {
  /** 현재 페이지 제목 (예: '대시보드'). */
  title: string
  /** 읽지 않은 알림 개수. 0이면 뱃지를 숨깁니다. */
  notificationCount?: number
}

/**
 * 관리자 화면 상단 바. 페이지 제목 + 알림 + 사용자 정보를 표시합니다.
 *
 * @param props - {@link TopBarProps}
 * @returns 상단 바 엘리먼트
 */
export default function TopBar({ title, notificationCount = 0 }: TopBarProps) {
  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>

      <div className="topbar-right">
        <button type="button" className="topbar-bell" aria-label="알림">
          <Bell size={20} />
          {notificationCount > 0 && <span className="topbar-badge">{notificationCount}</span>}
        </button>

        <div className="topbar-user">
          <span className="topbar-avatar">
            <User size={18} />
          </span>
          <span className="topbar-user-text">
            <strong>관리자</strong>
            <small>IT관리팀</small>
          </span>
        </div>
      </div>
    </header>
  )
}
