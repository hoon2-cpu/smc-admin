import { createContext, useContext } from 'react'
import type { AuthUser } from './useGoogleAuth'

/** 앱 전역 인증 컨텍스트 값. */
interface AuthContextValue {
  /** 로그인 사용자(게이트 비활성 또는 미로그인 시 null). */
  user: AuthUser | null
  /** 로그아웃. */
  signOut: () => void
}

/** 인증 컨텍스트. 기본값은 미로그인 상태. */
export const AuthContext = createContext<AuthContextValue>({
  user: null,
  signOut: () => {},
})

/**
 * 현재 로그인 상태와 로그아웃 함수를 반환합니다.
 * @returns 인증 컨텍스트 값
 */
export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
