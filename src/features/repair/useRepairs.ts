import { useCallback, useEffect, useMemo, useState } from 'react'
import { isMockMode } from '@/lib/gasClient'
import { fetchRepairs } from './api'
import { REPAIR_MOCK } from './mock/repairMock'
import type { RepairRow, RepairSummary } from './types'

/** {@link useRepairs} 반환 형태. */
export interface UseRepairsReturn {
  /** 수리 접수 목록. */
  repairs: RepairRow[]
  /** 상태별 요약. */
  summary: RepairSummary
  /** 조회 진행 중 여부. */
  loading: boolean
  /** mock 사용 중 여부. */
  usingMock: boolean
  /** 저장 성공 후 특정 접수를 로컬 목록에서 즉시 갱신. */
  patchRepair: (ticketNumber: string, patch: Partial<RepairRow>) => void
}

/**
 * 수리 접수 목록 + 요약 훅. (useAssets와 동일한 GAS 조회 + mock 폴백 패턴)
 *
 * @returns 수리 목록·요약·로딩 ({@link UseRepairsReturn})
 */
export function useRepairs(): UseRepairsReturn {
  const [repairs, setRepairs] = useState<RepairRow[]>(REPAIR_MOCK)
  const [loading, setLoading] = useState<boolean>(!isMockMode())
  const [usingMock, setUsingMock] = useState<boolean>(true)

  useEffect(() => {
    if (isMockMode()) return
    let alive = true
    fetchRepairs().then((real) => {
      if (!alive) return
      if (real) {
        setRepairs(real)
        setUsingMock(false)
      }
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  const patchRepair = useCallback((ticketNumber: string, patch: Partial<RepairRow>) => {
    setRepairs((prev) =>
      prev.map((r) => (r.ticketNumber === ticketNumber ? { ...r, ...patch } : r)),
    )
  }, [])

  const summary = useMemo<RepairSummary>(
    () => ({
      received: repairs.filter((r) => r.status === '접수').length,
      inProgress: repairs.filter((r) => r.status === '수리중').length,
      done: repairs.filter((r) => r.status === '완료').length,
    }),
    [repairs],
  )

  return { repairs, summary, loading, usingMock, patchRepair }
}
