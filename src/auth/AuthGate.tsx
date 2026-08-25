import { useState, type FormEvent, type ReactNode } from 'react'
import { isAuthEnabled } from '@/config/auth'
import { usePasswordAuth } from './usePasswordAuth'
import { AuthContext } from './AuthContext'
import './AuthGate.css'

/**
 * 공용 비밀번호 로그인 게이트.
 * 게이트가 활성이고 미인증이면 비밀번호 화면을, 아니면 앱을 렌더링합니다.
 *
 * @param props.children - 인증 후 렌더링할 앱
 * @returns 로그인 화면 또는 앱
 */
export default function AuthGate({ children }: { children: ReactNode }) {
  const { authed, error, signIn, signOut } = usePasswordAuth()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  /** 로그인 폼 제출. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    await signIn(password)
    setBusy(false)
    setPassword('')
  }

  if (isAuthEnabled() && !authed) {
    return (
      <div className="auth-screen">
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-brand">
            The SMC <span>Admin Platform</span>
          </div>
          <p className="auth-desc">접근하려면 공용 비밀번호를 입력하세요.</p>
          <input
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            autoFocus
          />
          <button type="submit" className="auth-submit" disabled={busy || !password}>
            {busy ? '확인 중…' : '로그인'}
          </button>
          {error && <p className="auth-error">{error}</p>}
        </form>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ authed: true, signOut }}>{children}</AuthContext.Provider>
  )
}
