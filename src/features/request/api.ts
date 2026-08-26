import { submitToGas, type GasResult } from '@/lib/gasClient'

/** 자산 신청 폼 값. */
export interface AssetRequestValues {
  requester: string
  department: string
  category: string
  spec: string
  reason: string
  wantDate: string
}

/** 반납 신청 폼 값. */
export interface ReturnRequestValues {
  requester: string
  department: string
  assetNumber: string
  assetName: string
  reason: string
  note: string
}

/**
 * 자산 신청을 백엔드로 전송합니다.
 * @param values - 자산 신청 값
 * @returns 서버 응답
 */
export function submitAssetRequest(values: AssetRequestValues): Promise<GasResult> {
  return submitToGas('assetRequest', values)
}

/**
 * 반납 신청을 백엔드로 전송합니다.
 * @param values - 반납 신청 값
 * @returns 서버 응답
 */
export function submitReturnRequest(values: ReturnRequestValues): Promise<GasResult> {
  return submitToGas('returnRequest', values)
}
