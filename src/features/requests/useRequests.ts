import { useCallback, useEffect, useState } from 'react'
import { isMockMode } from '@/lib/gasClient'
import { fetchRequests } from './api'
import { REQUESTS_MOCK } from './mock/requestsMock'
import type { RequestRow } from './types'

/** {@link useRequests} 반환 형태. */
export interface UseRequestsReturn {
  /** 신청 목록(최신 먼저). */
  requests: RequestRow[]
  /** 조회 진행 중 여부. */
  loading: boolean
  /** mock 사용 중 여부. */
  usingMock: boolean
  /** 처리 후 로컬 목록에 즉시 반영(rowIndex 기준 교체). */
  patchRequest: (row: RequestRow) => void
}

/**
 * 직원 신청 목록 훅. (GAS 조회 + mock 폴백; 처리 후 로컬 반영)
 *
 * @returns 신청 목록·로딩·patch ({@link UseRequestsReturn})
 */
export function useRequests(): UseRequestsReturn {
  const [requests, setRequests] = useState<RequestRow[]>(REQUESTS_MOCK)
  const [loading, setLoading] = useState<boolean>(!isMockMode())
  const [usingMock, setUsingMock] = useState<boolean>(true)

  useEffect(() => {
    if (isMockMode()) return
    let alive = true
    fetchRequests().then((real) => {
      if (!alive) return
      if (real) {
        setRequests(real)
        setUsingMock(false)
      }
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  // rowIndex 기준 교체(처리 결과 즉시 반영)
  const patchRequest = useCallback((row: RequestRow) => {
    setRequests((prev) => prev.map((r) => (r.rowIndex === row.rowIndex ? row : r)))
  }, [])

  return { requests, loading, usingMock, patchRequest }
}
