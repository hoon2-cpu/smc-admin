import { useMemo } from 'react'
import { ASSET_MOCK } from './mock/assetMock'
import type { AssetRow, AssetSummary } from './types'

/** {@link useAssets} 반환 형태. */
export interface UseAssetsReturn {
  /** 자산 목록. */
  assets: AssetRow[]
  /** 상태별 요약. */
  summary: AssetSummary
}

/**
 * 자산 목록과 요약 통계를 제공하는 훅.
 * 현재는 mock 기반이며, 요약은 목록에서 파생 계산합니다.
 * (추후 GAS `?action=assets` 조회로 교체 — useDashboardData와 동일 패턴)
 *
 * @returns 자산 목록 + 요약 ({@link UseAssetsReturn})
 */
export function useAssets(): UseAssetsReturn {
  const assets = ASSET_MOCK

  // 목록이 바뀔 때만 요약을 다시 계산
  const summary = useMemo<AssetSummary>(
    () => ({
      total: assets.length,
      inUse: assets.filter((a) => a.status === '사용중').length,
      repairing: assets.filter((a) => a.status === '수리중').length,
      disposal: assets.filter((a) => a.status === '폐기예정' || a.status === '폐기').length,
    }),
    [assets],
  )

  return { assets, summary }
}
