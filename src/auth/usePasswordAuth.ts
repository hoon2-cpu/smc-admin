import { useCallback, useState } from 'react'
import { ACCESS_PASSWORD_SHA256 } from '@/config/auth'
import { sha256Hex } from '@/lib/sha256'

const STORAGE_KEY = 'smc.authed'

/** {@link usePasswordAuth} 반환 형태. */
export interface UsePasswordAuthReturn {
  /** 인증 통과 여부. */
  authed: boolean
  /** 로그인 실패 메시지. */
  error: string
  /** 비밀번호로 로그인 시도. 성공 시 true. */
  signIn: (password: string) => Promise<boolean>
  /** 로그아웃. */
  signOut: () => void
}

/** 저장된 인증 플래그를 읽습니다. */
function loadAuthed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * 공용 비밀번호 로그인 상태를 관리하는 훅.
 * 입력 비밀번호의 SHA-256 해시를 설정값과 비교해 인증합니다.
 *
 * @returns 인증 상태와 조작 ({@link UsePasswordAuthReturn})
 */
export function usePasswordAuth(): UsePasswordAuthReturn {
  const [authed, setAuthed] = useState<boolean>(loadAuthed)
  const [error, setError] = useState('')

  const signIn = useCallback(async (password: string): Promise<boolean> => {
    const hash = await sha256Hex(password)
    if (hash === ACCESS_PASSWORD_SHA256) {
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // 저장 실패해도 이번 세션은 통과 처리
      }
      setError('')
      setAuthed(true)
      return true
    }
    setError('비밀번호가 올바르지 않습니다.')
    return false
  }, [])

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // 무시
    }
    setAuthed(false)
  }, [])

  return { authed, error, signIn, signOut }
}
