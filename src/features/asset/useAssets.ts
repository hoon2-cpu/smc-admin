import { useCallback, useEffect, useMemo, useState } from 'react'
import { isMockMode } from '@/lib/gasClient'
import { fetchAssets } from './api'
import { ASSET_MOCK } from './mock/assetMock'
import type { AssetRow, AssetSummary } from './types'

/** {@link useAssets} 반환 형태. */
export interface UseAssetsReturn {
  /** 자산 목록. */
  assets: AssetRow[]
  /** 상태별 요약(목록에서 파생). */
  summary: AssetSummary
  /** 조회 진행 중 여부. */
  loading: boolean
  /** 실데이터 없이 mock을 쓰는 중인지(안내 배지용). */
  usingMock: boolean
  /** 특정 자산을 로컬 목록에서 즉시 갱신(저장 성공 후 UI 반영). */
  patchAsset: (assetNumber: string, patch: Partial<AssetRow>) => void
}

/**
 * 자산 목록 + 요약 통계 훅.
 * mock 모드면 즉시 mock을 쓰고, 실사용 모드면 GAS에서 조회합니다.
 * 조회 실패/미배포(null)면 mock을 유지합니다. (useDashboardData와 동일 패턴)
 *
 * @returns 자산 목록·요약·로딩 상태 ({@link UseAssetsReturn})
 */
export function useAssets(): UseAssetsReturn {
  const [assets, setAssets] = useState<AssetRow[]>(ASSET_MOCK)
  const [loading, setLoading] = useState<boolean>(!isMockMode())
  const [usingMock, setUsingMock] = useState<boolean>(true)

  useEffect(() => {
    if (isMockMode()) return
    let alive = true
    fetchAssets().then((real) => {
      if (!alive) return
      // 조회에 성공하면(빈 배열 포함) 실데이터로 교체 — 진짜 시트 상태를 보여줌
      if (real) {
        setAssets(real)
        setUsingMock(false)
      }
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  // 저장 성공 후 서버 재조회 없이 해당 행만 즉시 반영 (mock/실데이터 공통)
  const patchAsset = useCallback((assetNumber: string, patch: Partial<AssetRow>) => {
    setAssets((prev) =>
      prev.map((a) => (a.assetNumber === assetNumber ? { ...a, ...patch } : a)),
    )
  }, [])

  const summary = useMemo<AssetSummary>(
    () => ({
      total: assets.length,
      inUse: assets.filter((a) => a.status === '사용중').length,
      repairing: assets.filter((a) => a.status === '수리중').length,
      disposal: assets.filter((a) => a.status === '폐기예정' || a.status === '폐기').length,
    }),
    [assets],
  )

  return { assets, summary, loading, usingMock, patchAsset }
}
