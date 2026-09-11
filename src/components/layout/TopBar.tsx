import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, User, LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/auth/AuthContext'
import { useRequests } from '@/features/requests/useRequests'
import './TopBar.css'

/** {@link TopBar} 컴포넌트 props. */
interface TopBarProps {
  /** 현재 페이지 제목 (예: '대시보드'). */
  title: string
  /** 모바일 햄버거 클릭 콜백(사이드바 드로어 토글). */
  onMenuClick?: () => void
}

/**
 * 관리자 화면 상단 바. (모바일) 햄버거 + 제목 + 알림 + 사용자 정보.
 * 알림 벨은 실제 신청(`6_신청기록`) 중 '접수(대기)' 건을 뱃지·목록으로 보여주고,
 * 클릭하면 신청관리 화면으로 이동합니다.
 *
 * @param props - {@link TopBarProps}
 * @returns 상단 바 엘리먼트
 */
export default function TopBar({ title, onMenuClick }: TopBarProps) {
  const { role, signOut } = useAuth()
  const navigate = useNavigate()
  const [bellOpen, setBellOpen] = useState(false)
  const { requests } = useRequests()

  // 미처리(접수) 신청 = 알림. 최신순으로 최대 8건 표시, 뱃지는 접수 건수.
  const pending = useMemo(() => requests.filter((r) => r.status === '접수'), [requests])
  const notificationCount = pending.length
  const notifyItems = useMemo(() => pending.slice(0, 8), [pending])

  /** 알림 항목 클릭 → 신청관리로 이동하고 팝업 닫기. */
  function goToRequests() {
    setBellOpen(false)
    navigate('/admin/requests')
  }

  return (
    <header className="topbar">
      <button type="button" className="topbar-menu" aria-label="메뉴" onClick={onMenuClick}>
        <Menu size={22} />
      </button>
      <h1 className="topbar-title">{title}</h1>

      <div className="topbar-right">
        <div className="topbar-bell-wrap">
          <button
            type="button"
            className="topbar-bell"
            aria-label="알림"
            onClick={() => setBellOpen((o) => !o)}
          >
            <Bell size={20} />
            {notificationCount > 0 && <span className="topbar-badge">{notificationCount}</span>}
          </button>
          {bellOpen && (
            <>
              <div className="topbar-pop-backdrop" onClick={() => setBellOpen(false)} />
              <div className="topbar-pop" role="dialog">
                <div className="topbar-pop-head">알림 · 접수 대기 {notificationCount}건</div>
                {notifyItems.length === 0 ? (
                  <div className="topbar-pop-empty">새 신청이 없습니다.</div>
                ) : (
                  <ul className="topbar-notif-list">
                    {notifyItems.map((r) => (
                      <li key={r.rowIndex}>
                        <button type="button" className="topbar-notif-item" onClick={goToRequests}>
                          <span className="topbar-notif-kind">{r.kind}</span>
                          <span className="topbar-notif-title">
                            {r.requester}
                            {r.target ? ` · ${r.target}` : ''}
                          </span>
                          <span className="topbar-notif-date">{r.requestedAt}</span>
                        </button>
                      </li>
                    ))}
                    <li>
                      <button type="button" className="topbar-notif-more" onClick={goToRequests}>
                        신청관리에서 모두 보기 →
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

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
