import { submitToGas, type GasResult } from '@/lib/gasClient'
import type { AssetRegisterFormValues } from './formConfig'

/**
 * 자산 등록 폼을 백엔드로 제출합니다.
 * (mock 모드에서는 콘솔 출력 후 성공을 반환)
 *
 * @param values - 자산 등록 폼 값
 * @returns 서버 응답
 */
export function submitAssetRegister(values: AssetRegisterFormValues): Promise<GasResult> {
  return submitToGas('assetRegister', values)
}
