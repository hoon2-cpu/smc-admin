import { Bell, User, LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/auth/AuthContext'
import './TopBar.css'

/** {@link TopBar} 컴포넌트 props. */
interface TopBarProps {
  /** 현재 페이지 제목 (예: '대시보드'). */
  title: string
  /** 읽지 않은 알림 개수. 0이면 뱃지를 숨깁니다. */
  notificationCount?: number
  /** 모바일 햄버거 클릭 콜백(사이드바 드로어 토글). */
  onMenuClick?: () => void
}

/**
 * 관리자 화면 상단 바. (모바일) 햄버거 + 제목 + 알림 + 사용자 정보.
 *
 * @param props - {@link TopBarProps}
 * @returns 상단 바 엘리먼트
 */
export default function TopBar({ title, notificationCount = 0, onMenuClick }: TopBarProps) {
  const { role, signOut } = useAuth()

  return (
    <header className="topbar">
      <button type="button" className="topbar-menu" aria-label="메뉴" onClick={onMenuClick}>
        <Menu size={22} />
      </button>
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

        {role && (
          <button type="button" className="topbar-logout" onClick={signOut} aria-label="로그아웃">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  )
}
