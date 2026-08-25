import { useCallback, useEffect, useRef, useState } from 'react'
import { GOOGLE_CLIENT_ID, ALLOWED_EMAIL_DOMAIN } from '@/config/auth'
import { decodeJwt } from '@/lib/jwt'

/** 로그인된 사용자 정보(+ ID 토큰). */
export interface AuthUser {
  email: string
  name: string
  picture: string
  /** 구글 ID 토큰(JWT). 서버 검증에 사용할 수 있음. */
  token: string
  /** 만료 시각(Unix seconds). */
  exp: number
}

const STORAGE_KEY = 'smc.auth'
const GIS_SRC = 'https://accounts.google.com/gsi/client'

// Google Identity Services 최소 타입 (any 없이)
interface GsiId {
  initialize(config: {
    client_id: string
    callback: (res: { credential: string }) => void
    auto_select?: boolean
  }): void
  renderButton(parent: HTMLElement, options: Record<string, unknown>): void
  disableAutoSelect(): void
}
declare global {
  interface Window {
    google?: { accounts: { id: GsiId } }
  }
}

/** 저장된 로그인 정보를 불러옵니다(만료면 null). */
function loadStored(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const user = JSON.parse(raw) as AuthUser
    if (!user.exp || user.exp * 1000 < Date.now()) return null
    return user
  } catch {
    return null
  }
}

/** {@link useGoogleAuth} 반환 형태. */
export interface UseGoogleAuthReturn {
  /** 로그인된 사용자(없으면 null). */
  user: AuthUser | null
  /** 로그인 실패/거부 메시지. */
  error: string
  /** 구글 버튼을 렌더링할 컨테이너 ref. */
  buttonRef: React.RefObject<HTMLDivElement>
  /** 로그아웃. */
  signOut: () => void
}

/**
 * 구글 로그인(회사 도메인 제한) 상태를 관리하는 훅.
 * GIS 스크립트를 로드해 버튼을 렌더링하고, 로그인 시 도메인을 검증합니다.
 *
 * @returns 로그인 상태와 조작 ({@link UseGoogleAuthReturn})
 */
export function useGoogleAuth(): UseGoogleAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(() => loadStored())
  const [error, setError] = useState('')
  const buttonRef = useRef<HTMLDivElement>(null)

  // 구글이 전달한 자격증명(JWT)을 검증하고 로그인 처리
  const handleCredential = useCallback((credential: string) => {
    const payload = decodeJwt(credential)
    if (!payload || !payload.email) {
      setError('로그인 정보를 읽지 못했습니다. 다시 시도해주세요.')
      return
    }
    const domain = payload.hd || payload.email.split('@')[1]
    if (domain !== ALLOWED_EMAIL_DOMAIN) {
      setError(`회사 계정(@${ALLOWED_EMAIL_DOMAIN})만 로그인할 수 있습니다.`)
      return
    }
    const authUser: AuthUser = {
      email: payload.email,
      name: payload.name || payload.email,
      picture: payload.picture || '',
      token: credential,
      exp: payload.exp || 0,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    setError('')
    setUser(authUser)
  }, [])

  useEffect(() => {
    if (user) return

    // GIS 초기화 + 버튼 렌더
    function init() {
      const gis = window.google?.accounts.id
      if (!gis) return
      gis.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (res) => handleCredential(res.credential),
      })
      if (buttonRef.current) {
        gis.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 260,
          text: 'signin_with',
          locale: 'ko',
        })
      }
    }

    if (window.google) {
      init()
      return
    }
    // 스크립트 동적 로드(이미 있으면 재사용, 스크립트는 정리하지 않고 남겨둠)
    let script = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = GIS_SRC
      script.async = true
      document.head.appendChild(script)
    }
    script.addEventListener('load', init)
    return () => script?.removeEventListener('load', init)
  }, [user, handleCredential])

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    window.google?.accounts.id.disableAutoSelect()
    setUser(null)
  }, [])

  return { user, error, buttonRef, signOut }
}
