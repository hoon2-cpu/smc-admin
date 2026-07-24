import { submitToGas, type GasResult } from '@/lib/gasClient'
import type { RepairFormValues } from './formConfig'

/**
 * 수리 요청 폼을 백엔드로 제출합니다.
 * 서버가 접수번호를 부여하면 응답의 `ticketNumber`로 돌려줍니다.
 * (mock 모드에서는 접수번호 없이 성공만 반환 → 화면은 로컬 생성값 사용)
 *
 * @param values - 수리 요청 폼 값
 * @returns 서버 응답
 */
export function submitRepairRequest(values: RepairFormValues): Promise<GasResult> {
  return submitToGas('repairRequest', values)
}
