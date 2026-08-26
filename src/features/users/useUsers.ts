import { useCallback, useEffect, useState } from 'react'
import { isMockMode } from '@/lib/gasClient'
import { fetchUsers } from './api'
import { USERS_MOCK } from './mock/usersMock'
import type { UserRow } from './types'

/** {@link useUsers} 반환 형태. */
export interface UseUsersReturn {
  /** 사용자 목록. */
  users: UserRow[]
  /** 조회 진행 중 여부. */
  loading: boolean
  /** mock 사용 중 여부. */
  usingMock: boolean
  /** 등록/수정 후 로컬 목록에 즉시 반영(사번 기준 upsert). */
  upsertUser: (user: UserRow) => void
}

/**
 * 사용자 목록 훅. (GAS 조회 + mock 폴백; 저장 후 로컬 upsert 반영)
 *
 * @returns 사용자 목록·로딩·upsert ({@link UseUsersReturn})
 */
export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<UserRow[]>(USERS_MOCK)
  const [loading, setLoading] = useState<boolean>(!isMockMode())
  const [usingMock, setUsingMock] = useState<boolean>(true)

  useEffect(() => {
    if (isMockMode()) return
    let alive = true
    fetchUsers().then((real) => {
      if (!alive) return
      if (real) {
        setUsers(real)
        setUsingMock(false)
      }
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  // 사번 기준 upsert: 있으면 교체, 없으면 추가
  const upsertUser = useCallback((user: UserRow) => {
    setUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id)
      return exists ? prev.map((u) => (u.id === user.id ? user : u)) : [...prev, user]
    })
  }, [])

  return { users, loading, usingMock, upsertUser }
}
