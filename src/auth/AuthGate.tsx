import type { ReactNode, RefObject } from 'react'
import { isAuthEnabled } from '@/config/auth'
import { useGoogleAuth } from './useGoogleAuth'
import { AuthContext } from './AuthContext'
import './AuthGate.css'

/** 로그인 화면(미로그인 시 표시). */
function LoginScreen({ buttonRef, error }: { buttonRef: RefObject<HTMLDivElement>; error: string }) {
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          The SMC <span>Admin Platform</span>
        </div>
        <p className="auth-desc">회사 Google 계정(@thesmc.co.kr)으로 로그인하세요.</p>
        <div ref={buttonRef} className="auth-button" />
        {error && <p className="auth-error">{error}</p>}
      </div>
    </div>
  )
}

/**
 * 인증 게이트. 로그인 게이트가 활성이고 미로그인이면 로그인 화면을,
 * 아니면 자식(앱)을 렌더링하며 인증 컨텍스트를 제공합니다.
 *
 * @param props.children - 인증 후 렌더링할 앱
 * @returns 로그인 화면 또는 앱
 */
export default function AuthGate({ children }: { children: ReactNode }) {
  const auth = useGoogleAuth()

  if (isAuthEnabled() && !auth.user) {
    return <LoginScreen buttonRef={auth.buttonRef} error={auth.error} />
  }

  return (
    <AuthContext.Provider value={{ user: auth.user, signOut: auth.signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
