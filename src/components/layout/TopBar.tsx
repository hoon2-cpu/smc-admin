import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, User, LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/auth/AuthContext'
import { useRequests } from '@/features/requests/useRequests'
import './TopBar.css'

/** 확인 처리한 알림(신청 rowIndex) 저장 키. */
const SEEN_KEY = 'smc.notif.seen'

/** 확인 처리한 신청 rowIndex 목록을 읽습니다. */
function loadSeen(): number[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    return raw ? (JSON.parse(raw) as number[]) : []
  } catch {
    return []
  }
}

/** 확인 처리 목록을 저장합니다. */
function saveSeen(ids: number[]): void {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids))
  } catch {
    // 저장 실패 무시
  }
}

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
  // 확인 처리한 신청 rowIndex(로컬 저장) — 새 신청이 오기 전까지 뱃지에서 제외.
  const [seen, setSeen] = useState<number[]>(() => loadSeen())

  // 미처리(접수) 신청 = 알림. 뱃지는 '아직 확인 안 한' 건수만 카운트.
  const pending = useMemo(() => requests.filter((r) => r.status === '접수'), [requests])
  const notifyItems = useMemo(() => pending.slice(0, 8), [pending])
  const notificationCount = useMemo(
    () => pending.filter((r) => !seen.includes(r.rowIndex)).length,
    [pending, seen],
  )

  /** 현재 접수 건을 모두 '확인'으로 표시 → 뱃지 사라짐(로컬 저장). */
  function markAllRead() {
    const ids = pending.map((r) => r.rowIndex)
    setSeen(ids)
    saveSeen(ids)
  }

  /** 알림 항목 클릭 → 확인 처리 + 신청관리로 이동하고 팝업 닫기. */
  function goToRequests() {
    markAllRead()
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
                <div className="topbar-pop-head">
                  <span>알림 · 미확인 {notificationCount}건</span>
                  {notificationCount > 0 && (
                    <button type="button" className="topbar-notif-readall" onClick={markAllRead}>
                      모두 확인 ✕
                    </button>
                  )}
                </div>
                {notifyItems.length === 0 ? (
                  <div className="topbar-pop-empty">접수 대기 신청이 없습니다.</div>
                ) : (
                  <ul className="topbar-notif-list">
                    {notifyItems.map((r) => (
                      <li key={r.rowIndex}>
                        <button type="button" className="topbar-notif-item" onClick={goToRequests}>
                          <span className="topbar-notif-kind">
                            {!seen.includes(r.rowIndex) && <span className="topbar-notif-dot" aria-label="미확인" />}
                            {r.kind}
                          </span>
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
