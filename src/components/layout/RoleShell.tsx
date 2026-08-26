import type { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/auth/AuthContext'
import './RoleShell.css'

/** {@link RoleShell} 컴포넌트 props. */
interface RoleShellProps {
  /** 헤더에 표시할 화면 제목. */
  title: string
  /** 본문 내용. */
  children: ReactNode
}

/**
 * 비-관리자(직원/외부업체) 화면용 간단 레이아웃.
 * 상단에 로고 + 제목 + 로그아웃, 아래에 중앙 정렬 콘텐츠. 모바일 우선.
 *
 * @param props - {@link RoleShellProps}
 * @returns 레이아웃 엘리먼트
 */
export default function RoleShell({ title, children }: RoleShellProps) {
  const { signOut } = useAuth()
  return (
    <div className="role-shell">
      <header className="role-header">
        <div className="role-brand">
          the <b>SMC</b>
        </div>
        <div className="role-header-right">
          <span className="role-title">{title}</span>
          <button type="button" className="role-logout" onClick={signOut} aria-label="로그아웃">
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <main className="role-content">{children}</main>
    </div>
  )
}
