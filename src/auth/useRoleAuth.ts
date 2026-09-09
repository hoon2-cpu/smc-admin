import { useCallback, useEffect, useState } from 'react'
import { type Role } from '@/config/auth'
import { getEffectiveHashes, pullAuthFromServer } from '@/app/authSettings'
import { sha256Hex } from '@/lib/sha256'

const STORAGE_KEY = 'smc.role'

/** {@link useRoleAuth} 반환 형태. */
export interface UseRoleAuthReturn {
  /** 로그인된 역할(없으면 null). */
  role: Role | null
  /** 로그인 실패 메시지. */
  error: string
  /** 비밀번호로 로그인 시도. 성공 시 해당 역할, 실패 시 null. */
  signIn: (password: string) => Promise<Role | null>
  /** 로그아웃. */
  signOut: () => void
}

/** 저장된 역할을 불러옵니다(유효한 역할일 때만). */
function loadRole(): Role | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw && raw in getEffectiveHashes()) return raw as Role
    return null
  } catch {
    return null
  }
}

/**
 * 역할별 비밀번호 로그인 훅.
 * 입력 비밀번호의 SHA-256 해시를 역할별 해시와 대조해 역할을 판별합니다.
 *
 * @returns 역할 상태와 조작 ({@link UseRoleAuthReturn})
 */
export function useRoleAuth(): UseRoleAuthReturn {
  const [role, setRole] = useState<Role | null>(loadRole)
  const [error, setError] = useState('')

  // 서버에 저장된 비밀번호 오버라이드를 1회 당겨와 캐시에 반영(다른 기기에서 바꾼 비번 동기화)
  useEffect(() => {
    void pullAuthFromServer()
  }, [])

  const signIn = useCallback(async (password: string): Promise<Role | null> => {
    const hash = await sha256Hex(password)
    const hashes = getEffectiveHashes()
    const matched = (Object.keys(hashes) as Role[]).find((r) => hashes[r] === hash)
    if (matched) {
      try {
        localStorage.setItem(STORAGE_KEY, matched)
      } catch {
        // 저장 실패해도 이번 세션은 통과
      }
      setError('')
      setRole(matched)
      return matched
    }
    setError('비밀번호가 올바르지 않습니다.')
    return null
  }, [])

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // 무시
    }
    setRole(null)
  }, [])

  return { role, error, signIn, signOut }
}
