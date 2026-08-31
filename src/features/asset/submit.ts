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

/** 대량 등록 결과 요약. */
export interface BulkRegisterResult {
  /** 성공 건수. */
  ok: number
  /** 실패한 자산명 목록. */
  failed: string[]
}

/**
 * 여러 자산을 일괄 등록합니다.
 *
 * @remarks
 * 서버가 자산번호(AST-YYYY-####)를 순번으로 발급하므로, 번호 충돌을 피하려
 * 순차 전송합니다. 각 행은 assetRegister와 동일한 폼 값 형태입니다.
 *
 * @param rows - 등록할 자산 폼 값 목록
 * @returns 성공/실패 요약 ({@link BulkRegisterResult})
 */
export async function submitAssetRegisterBulk(
  rows: AssetRegisterFormValues[],
): Promise<BulkRegisterResult> {
  const failed: string[] = []
  let ok = 0
  for (const row of rows) {
    const result = await submitToGas('assetRegister', row)
    if (result.ok) ok += 1
    else failed.push(row.name || '(이름 없음)')
  }
  return { ok, failed }
}
