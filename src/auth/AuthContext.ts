import { createContext, useContext } from 'react'

/** 앱 전역 인증 컨텍스트 값. */
interface AuthContextValue {
  /** 인증 통과 여부. */
  authed: boolean
  /** 로그아웃. */
  signOut: () => void
}

/** 인증 컨텍스트. 기본값은 미인증 상태. */
export const AuthContext = createContext<AuthContextValue>({
  authed: false,
  signOut: () => {},
})

/**
 * 현재 인증 상태와 로그아웃 함수를 반환합니다.
 * @returns 인증 컨텍스트 값
 */
export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
