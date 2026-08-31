import { getFromGas, submitToGas, type GasResult } from '@/lib/gasClient'
import type { RequestRow, RequestUpdateValues } from './types'

/** GAS `?action=requests` 응답 형식. */
interface RequestsResponse {
  ok?: boolean
  requests?: RequestRow[]
}

/**
 * 직원 신청 목록을 조회합니다.
 * @returns 신청 배열, 실패/mock/미배포 시 null
 */
export async function fetchRequests(): Promise<RequestRow[] | null> {
  try {
    const json = (await getFromGas({ action: 'requests' })) as RequestsResponse | null
    if (json && json.ok && Array.isArray(json.requests)) return json.requests
    return null
  } catch (error) {
    console.error('[신청 목록 조회 실패]', error)
    return null
  }
}

/**
 * 신청 건의 처리 상태/방법/메모를 갱신합니다.
 * @param values - 처리 갱신 값(행번호로 대상 식별)
 * @returns 서버 응답
 */
export function updateRequest(values: RequestUpdateValues): Promise<GasResult> {
  return submitToGas('requestUpdate', values)
}
