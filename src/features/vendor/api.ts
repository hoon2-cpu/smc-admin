import { getFromGas } from '@/lib/gasClient'
import type { RepairRow } from '@/features/repair/types'

/** GAS `?action=vendorRepairs` 응답 형식. */
interface VendorRepairsResponse {
  ok?: boolean
  repairs?: RepairRow[]
}

/**
 * 외부업체로 전달된 수리 건 목록을 조회합니다. (전달된 것만 서버가 반환)
 *
 * @returns 수리 목록, 실패/mock/미배포 시 null
 */
export async function fetchVendorRepairs(): Promise<RepairRow[] | null> {
  try {
    const json = (await getFromGas({ action: 'vendorRepairs' })) as VendorRepairsResponse | null
    if (json && json.ok && Array.isArray(json.repairs)) return json.repairs
    return null
  } catch (error) {
    console.error('[외부업체 수리목록 조회 실패]', error)
    return null
  }
}
