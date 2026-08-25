import { getFromGas } from '@/lib/gasClient'
import type { RepairRow } from './types'

/** GAS `?action=repairs` 응답 형식. */
interface RepairsResponse {
  ok?: boolean
  repairs?: RepairRow[]
}

/**
 * GAS 웹앱에서 수리 접수 목록을 조회합니다.
 *
 * @returns 수리 목록, 또는 실패/mock 모드/미배포 시 `null`
 */
export async function fetchRepairs(): Promise<RepairRow[] | null> {
  try {
    const json = (await getFromGas({ action: 'repairs' })) as RepairsResponse | null
    if (json && json.ok && Array.isArray(json.repairs)) return json.repairs
    return null
  } catch (error) {
    console.error('[수리 목록 조회 실패]', error)
    return null
  }
}
