import { submitToGas, type GasResult } from '@/lib/gasClient'
import type { RepairFormValues } from './formConfig'

/**
 * 수리 요청 폼을 백엔드로 제출합니다.
 * 서버가 접수번호를 부여하면 응답의 `ticketNumber`로 돌려줍니다.
 * (mock 모드에서는 접수번호 없이 성공만 반환 → 화면은 로컬 생성값 사용)
 *
 * @remarks
 * 사진은 `photos`(파일명)과 `images`(축소된 data URL)로 분리해 전송합니다.
 * GAS가 `images`를 Google Drive에 업로드하고 공개 URL을 시트에 저장합니다.
 *
 * @param values - 수리 요청 폼 값
 * @returns 서버 응답
 */
export function submitRepairRequest(values: RepairFormValues): Promise<GasResult> {
  const { photos, ...rest } = values
  return submitToGas('repairRequest', {
    ...rest,
    photos: photos.map((p) => p.name), // 파일명(로그/폴백용)
    images: photos.map((p) => p.dataUrl), // 업로드용 data URL
  })
}
