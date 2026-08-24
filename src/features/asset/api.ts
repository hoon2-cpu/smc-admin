import { getFromGas } from '@/lib/gasClient'
import type { AssetRow } from './types'

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
