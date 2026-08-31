import { useMemo, useState } from 'react'
import { bulkDisposeAssets } from './api'
import { printAssetLabels } from './labelPrint'
import type { UseAssetSelectionReturn } from './useAssetSelection'
import type { AssetRow } from './types'

/** {@link useAssetBulkActions} 반환 형태. */
export interface UseAssetBulkActionsReturn {
  /** 선택된 자산 행 목록. */
  selectedAssets: AssetRow[]
  /** 대량 처리 진행 중 여부. */
  bulkBusy: boolean
  /** 선택 자산 라벨 일괄 인쇄. */
  handleBulkPrint: () => void
  /** 선택 자산 대량 폐기(확인 → 순차 처리 → 로컬 반영). */
  handleBulkDispose: () => Promise<void>
}

/**
 * 자산 목록의 대량 작업(라벨 일괄 인쇄·대량 폐기) 로직 훅.
 * 목록 페이지에서 UI와 분리해 관리합니다.
 *
 * @param assets - 현재 로드된 자산 목록
 * @param selection - 다중 선택 상태 훅 반환값
 * @param patchAsset - 로컬 목록 즉시 반영 함수
 * @returns 대량 작업 상태/핸들러 ({@link UseAssetBulkActionsReturn})
 */
export function useAssetBulkActions(
  assets: AssetRow[],
  selection: UseAssetSelectionReturn,
  patchAsset: (assetNumber: string, patch: Partial<AssetRow>) => void,
): UseAssetBulkActionsReturn {
  const [bulkBusy, setBulkBusy] = useState(false)

  const selectedAssets = useMemo(
    () => assets.filter((a) => selection.isSelected(a.assetNumber)),
    [assets, selection],
  )

  function handleBulkPrint() {
    printAssetLabels(selectedAssets)
  }

  async function handleBulkDispose() {
    const targets = selectedAssets.filter((a) => a.status !== '폐기')
    if (targets.length === 0) {
      window.alert('폐기할 수 있는 자산이 없습니다. (이미 폐기된 자산 제외)')
      return
    }
    if (!window.confirm(`${targets.length}건을 폐기 처리할까요?\n상태가 "폐기"로 바뀌고 폐기일이 오늘로 기록됩니다.`)) {
      return
    }
    setBulkBusy(true)
    const result = await bulkDisposeAssets(targets)
    setBulkBusy(false)
    const today = new Date().toISOString().slice(0, 10)
    targets.forEach((a) => {
      if (!result.failed.includes(a.assetNumber || a.name)) {
        patchAsset(a.assetNumber, { status: '폐기', disposalDate: today })
      }
    })
    selection.clear()
    if (result.failed.length > 0) {
      window.alert(`${result.ok}건 폐기, ${result.failed.length}건 실패:\n${result.failed.join(', ')}`)
    }
  }

  return { selectedAssets, bulkBusy, handleBulkPrint, handleBulkDispose }
}
