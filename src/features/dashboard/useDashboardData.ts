import { useEffect, useState } from 'react'
import { isMockMode } from '@/lib/gasClient'
import { fetchDashboard } from './api'
import { DASHBOARD_MOCK } from './mock/dashboardMock'
import type { DashboardData } from './types'

/** {@link useDashboardData} 반환 형태. */
export interface DashboardState {
  /** 화면에 표시할 데이터 (실데이터 + mock 폴백 병합본). */
  data: DashboardData
  /** 조회 진행 중 여부. */
  loading: boolean
  /** 실데이터 없이 mock만 사용 중인지 여부(안내 배지용). */
  usingMock: boolean
}

/**
 * 서버 응답에 실제 자산 데이터가 있는지 판정합니다.
 * (자산이 0건이면 통계·집계가 모두 비어 mock을 유지하는 편이 화면상 일관적)
 *
 * @param real - 서버가 반환한 부분 데이터
 * @returns 의미 있는 실데이터가 있으면 true
 */
function hasRealData(real: Partial<DashboardData>): boolean {
  return (
    (real.stats?.totalAssets ?? 0) > 0 ||
    !!real.categories?.length ||
    !!real.recentAssets?.length ||
    !!real.requests?.length ||
    !!real.lowStock?.length ||
    !!real.disposals?.length
  )
}

/**
 * 실데이터(Partial)를 mock 위에 병합합니다.
 * 서버가 채우지 못한(빈) 섹션은 mock 값을 유지해, 재배포 전이나
 * 데이터가 없을 때도 화면이 비지 않도록 합니다.
 * (자산 0건이면 통계도 0이므로 mock 통계로 대체 → 도넛/통계 불일치 방지)
 *
 * @param real - 서버가 반환한 부분 데이터
 * @returns 완전한 {@link DashboardData}
 */
function mergeWithMock(real: Partial<DashboardData>): DashboardData {
  const statsHasData = (real.stats?.totalAssets ?? 0) > 0
  return {
    stats: statsHasData && real.stats ? real.stats : DASHBOARD_MOCK.stats,
    categories: real.categories?.length ? real.categories : DASHBOARD_MOCK.categories,
    requests: real.requests?.length ? real.requests : DASHBOARD_MOCK.requests,
    lowStock: real.lowStock?.length ? real.lowStock : DASHBOARD_MOCK.lowStock,
    recentAssets: real.recentAssets?.length ? real.recentAssets : DASHBOARD_MOCK.recentAssets,
    disposals: real.disposals?.length ? real.disposals : DASHBOARD_MOCK.disposals,
  }
}

/**
 * 관리자 대시보드 데이터 훅.
 * mock 모드면 즉시 mock을 반환하고, 실사용 모드면 GAS에서 조회해
 * mock 위에 병합합니다. 실패/미배포 시에는 mock을 유지합니다.
 *
 * @returns 대시보드 상태 ({@link DashboardState})
 */
export function useDashboardData(): DashboardState {
  const [data, setData] = useState<DashboardData>(DASHBOARD_MOCK)
  const [loading, setLoading] = useState<boolean>(!isMockMode())
  const [usingMock, setUsingMock] = useState<boolean>(true)

  useEffect(() => {
    if (isMockMode()) return

    // StrictMode 이중 실행/언마운트 후 setState 방지용 플래그
    let alive = true
    fetchDashboard().then((real) => {
      if (!alive) return
      if (real) {
        setData(mergeWithMock(real))
        // 실제 데이터가 있을 때만 mock 배지를 내립니다(빈 시트면 mock 유지).
        setUsingMock(!hasRealData(real))
      }
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  return { data, loading, usingMock }
}
