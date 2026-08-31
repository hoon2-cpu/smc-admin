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

/** 대량 폐기 결과 요약. */
export interface BulkDisposeResult {
  /** 성공 건수. */
  ok: number
  /** 실패한 자산번호 목록. */
  failed: string[]
}

/**
 * 여러 자산을 일괄 폐기 처리합니다. (상태='폐기', 폐기일=오늘)
 *
 * @remarks
 * 자산번호 발급/기록 충돌을 피하려 순차 처리합니다. 기존 사용자/부서/위치/담당자/비고는
 * 보존해 전송합니다(빈값 덮어쓰기 방지 — 단건 폐기와 동일 규칙).
 *
 * @param assets - 폐기할 자산 목록
 * @returns 성공/실패 요약 ({@link BulkDisposeResult})
 */
export async function bulkDisposeAssets(assets: AssetRow[]): Promise<BulkDisposeResult> {
  const today = new Date().toISOString().slice(0, 10)
  const failed: string[] = []
  let ok = 0
  for (const asset of assets) {
    const result = await updateAsset({
      assetNumber: asset.assetNumber,
      user: asset.user,
      department: asset.department,
      location: asset.location,
      status: '폐기',
      manager: asset.manager,
      note: asset.note,
      disposalDate: today,
    })
    if (result.ok) ok += 1
    else failed.push(asset.assetNumber || asset.name)
  }
  return { ok, failed }
}
