import { getFromGas, submitToGas, type GasResult } from '@/lib/gasClient'
import type { AssetRow, AssetUpdatePayload } from './types'

/** GAS `?action=assets` 응답 형식. */
interface AssetsResponse {
  ok?: boolean
  assets?: AssetRow[]
}

/**
 * GAS 웹앱에서 자산 목록을 조회합니다.
 *
 * @returns 자산 배열, 또는 실패/mock 모드/미배포 시 `null`
 */
export async function fetchAssets(): Promise<AssetRow[] | null> {
  try {
    const json = (await getFromGas({ action: 'assets' })) as AssetsResponse | null
    if (json && json.ok && Array.isArray(json.assets)) return json.assets
    return null
  } catch (error) {
    console.error('[자산 목록 조회 실패]', error)
    return null
  }
}

/**
 * 기존 자산의 운영 정보를 수정합니다. (상태/사용자/위치/담당자/비고/폐기일)
 *
 * @param payload - 수정할 자산 필드
 * @returns 서버 응답
 */
export function updateAsset(payload: AssetUpdatePayload): Promise<GasResult> {
  return submitToGas('assetUpdate', payload)
}
