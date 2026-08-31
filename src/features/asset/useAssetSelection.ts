import { useCallback, useMemo, useState } from 'react'

/** {@link useAssetSelection} 반환 형태. */
export interface UseAssetSelectionReturn {
  /** 선택된 자산번호 집합. */
  selected: Set<string>
  /** 선택 건수. */
  count: number
  /** 특정 자산번호가 선택됐는지. */
  isSelected: (assetNumber: string) => boolean
  /** 한 건 선택/해제 토글. */
  toggle: (assetNumber: string) => void
  /** 주어진 목록 전체 선택/해제(현재 보이는 목록 기준). */
  toggleAll: (assetNumbers: string[]) => void
  /** 선택 전체 해제. */
  clear: () => void
}

/**
 * 자산 목록의 다중 선택 상태를 관리하는 훅. (대량 폐기·라벨 일괄 인쇄용)
 * 자산번호(고유값)를 Set으로 관리합니다.
 *
 * @returns 선택 상태와 조작 함수 ({@link UseAssetSelectionReturn})
 */
export function useAssetSelection(): UseAssetSelectionReturn {
  const [selected, setSelected] = useState<Set<string>>(() => new Set())

  const isSelected = useCallback((assetNumber: string) => selected.has(assetNumber), [selected])

  const toggle = useCallback((assetNumber: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(assetNumber)) next.delete(assetNumber)
      else next.add(assetNumber)
      return next
    })
  }, [])

  // 현재 보이는 목록이 모두 선택돼 있으면 해제, 아니면 전부 추가
  const toggleAll = useCallback((assetNumbers: string[]) => {
    setSelected((prev) => {
      const allSelected = assetNumbers.length > 0 && assetNumbers.every((n) => prev.has(n))
      if (allSelected) {
        const next = new Set(prev)
        assetNumbers.forEach((n) => next.delete(n))
        return next
      }
      return new Set([...prev, ...assetNumbers])
    })
  }, [])

  const clear = useCallback(() => setSelected(new Set()), [])

  const count = useMemo(() => selected.size, [selected])

  return { selected, count, isSelected, toggle, toggleAll, clear }
}
