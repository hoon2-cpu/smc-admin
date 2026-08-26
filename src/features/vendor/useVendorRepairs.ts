import { useEffect, useState } from 'react'
import { isMockMode } from '@/lib/gasClient'
import { REPAIR_MOCK } from '@/features/repair/mock/repairMock'
import type { RepairRow } from '@/features/repair/types'
import { fetchVendorRepairs } from './api'

/** mock: 전달된(dispatched) 수리 건만 */
const VENDOR_MOCK = REPAIR_MOCK.filter((r) => r.dispatched)

/** {@link useVendorRepairs} 반환 형태. */
export interface UseVendorRepairsReturn {
  repairs: RepairRow[]
  loading: boolean
  usingMock: boolean
}

/**
 * 외부업체 화면용 수리 목록 훅. (GAS vendorRepairs 조회 + mock 폴백)
 *
 * @returns 전달된 수리 목록·로딩 상태
 */
export function useVendorRepairs(): UseVendorRepairsReturn {
  const [repairs, setRepairs] = useState<RepairRow[]>(VENDOR_MOCK)
  const [loading, setLoading] = useState<boolean>(!isMockMode())
  const [usingMock, setUsingMock] = useState<boolean>(true)

  useEffect(() => {
    if (isMockMode()) return
    let alive = true
    fetchVendorRepairs().then((real) => {
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

  return { repairs, loading, usingMock }
}
