import { getFromGas } from '@/lib/gasClient'
import type { DashboardData } from './types'

/** GAS `?action=dashboard` 응답 형식. */
interface DashboardResponse {
  ok?: boolean
  dashboard?: Partial<DashboardData>
}

/**
 * GAS 웹앱에서 대시보드 집계 데이터를 조회합니다.
 * 서버가 계산하지 못한 섹션은 생략될 수 있어 `Partial`로 받습니다.
 *
 * @returns 실데이터(부분 포함) 또는 실패/mock 모드 시 `null`
 */
export async function fetchDashboard(): Promise<Partial<DashboardData> | null> {
  try {
    const json = (await getFromGas({ action: 'dashboard' })) as DashboardResponse | null
    if (json && json.ok && json.dashboard) return json.dashboard
    return null
  } catch (error) {
    // 실패 시 null → 훅에서 mock으로 폴백
    console.error('[대시보드 조회 실패]', error)
    return null
  }
}
