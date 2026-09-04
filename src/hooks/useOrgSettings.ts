import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ORG_SETTINGS_EVENT,
  flattenDivisions,
  readDivisions,
  readLocations,
  resetDivisions,
  resetLocations,
  writeDivisions,
  writeLocations,
} from '@/app/orgSettings'
import type { Division } from '@/config/orgDefaults'

/** {@link useOrgSettings} 반환 형태. */
export interface UseOrgSettingsReturn {
  /** 부서 구조(본부→팀). */
  divisions: Division[]
  /** 셀렉트용 부서(팀) 평탄 옵션. */
  departmentOptions: string[]
  /** 사용위치 목록. */
  locations: string[]
  /** 부서 구조 저장. */
  setDivisions: (next: Division[]) => void
  /** 사용위치 저장. */
  setLocations: (next: string[]) => void
  /** 부서 기본값 복원. */
  resetDivisionsToDefault: () => void
  /** 위치 기본값 복원. */
  resetLocationsToDefault: () => void
}

/**
 * 조직(부서/사용위치) 설정 훅. 저장소 변경(같은 창·다른 탭)을 구독해 동기화합니다.
 * 폼 셀렉트는 `departmentOptions`/`locations`를, 설정 편집기는 `divisions`를 사용합니다.
 *
 * @returns 조직 설정 상태·조작 ({@link UseOrgSettingsReturn})
 */
export function useOrgSettings(): UseOrgSettingsReturn {
  const [divisions, setDivisionsState] = useState<Division[]>(readDivisions)
  const [locations, setLocationsState] = useState<string[]>(readLocations)

  useEffect(() => {
    const sync = () => {
      setDivisionsState(readDivisions())
      setLocationsState(readLocations())
    }
    window.addEventListener(ORG_SETTINGS_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(ORG_SETTINGS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const setDivisions = useCallback((next: Division[]) => writeDivisions(next), [])
  const setLocations = useCallback((next: string[]) => writeLocations(next), [])
  const resetDivisionsToDefault = useCallback(() => resetDivisions(), [])
  const resetLocationsToDefault = useCallback(() => resetLocations(), [])

  const departmentOptions = useMemo(() => flattenDivisions(divisions), [divisions])

  return {
    divisions,
    departmentOptions,
    locations,
    setDivisions,
    setLocations,
    resetDivisionsToDefault,
    resetLocationsToDefault,
  }
}
