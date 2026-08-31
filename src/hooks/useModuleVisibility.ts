import { useCallback, useEffect, useState } from 'react'
import {
  MODULE_VISIBILITY_EVENT,
  readOverrides,
  resetOverrides,
  setModuleVisibility,
  type VisibilityOverrides,
} from '@/app/moduleVisibility'

/** {@link useModuleVisibility} 반환 형태. */
export interface UseModuleVisibilityReturn {
  /** 현재 표시 여부 오버라이드 맵. */
  overrides: VisibilityOverrides
  /** 특정 모듈 표시 여부 설정. */
  setVisible: (id: string, visible: boolean) => void
  /** 기본값으로 초기화. */
  reset: () => void
}

/**
 * 모듈(사이드바 메뉴) 표시 여부를 읽고 바꾸는 훅.
 * 같은 창의 다른 컴포넌트(설정 화면 ↔ 사이드바)와 다른 탭 간 변경을 구독해 동기화합니다.
 *
 * @returns 오버라이드·설정·초기화 ({@link UseModuleVisibilityReturn})
 */
export function useModuleVisibility(): UseModuleVisibilityReturn {
  const [overrides, setOverrides] = useState<VisibilityOverrides>(readOverrides)

  useEffect(() => {
    const sync = () => setOverrides(readOverrides())
    // 같은 창 내 변경(커스텀 이벤트) + 다른 탭 변경(storage 이벤트) 모두 반영
    window.addEventListener(MODULE_VISIBILITY_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(MODULE_VISIBILITY_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const setVisible = useCallback((id: string, visible: boolean) => {
    setModuleVisibility(id, visible)
  }, [])

  const reset = useCallback(() => {
    resetOverrides()
  }, [])

  return { overrides, setVisible, reset }
}
