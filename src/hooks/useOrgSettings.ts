import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ORG_SETTINGS_EVENT,
  flattenDivisions,
  pullOrgFromServer,
  pushOrgToServer,
  readDivisions,
  readLocations,
  resetDivisions,
  resetLocations,
  writeDivisions,
  writeLocations,
} from '@/app/orgSettings'
import type { GasResult } from '@/lib/gasClient'
import { DEFAULT_DIVISIONS, DEFAULT_LOCATIONS, type Division } from '@/config/orgDefaults'

/** {@link useOrgSettings} 반환 형태. */
export interface UseOrgSettingsReturn {
  /** 부서 구조(본부→팀). */
  divisions: Division[]
  /** 셀렉트용 부서(팀) 평탄 옵션. */
  departmentOptions: string[]
  /** 사용위치 목록. */
  locations: string[]
  /** 부서 구조 저장(로컬 캐시 + 서버). */
  setDivisions: (next: Division[]) => Promise<GasResult>
  /** 사용위치 저장(로컬 캐시 + 서버). */
  setLocations: (next: string[]) => Promise<GasResult>
  /** 부서 기본값 복원(서버 반영). */
  resetDivisionsToDefault: () => Promise<GasResult>
  /** 위치 기본값 복원(서버 반영). */
  resetLocationsToDefault: () => Promise<GasResult>
}

/**
 * 조직(부서/사용위치) 설정 훅.
 * 마운트 시 서버(시트)에서 최신값을 한 번 불러오고(localStorage 캐시에 반영),
 * 저장 시 로컬 캐시 + 서버에 함께 반영합니다. 같은 창·다른 탭의 변경도 구독해 동기화합니다.
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
    // 서버 최신값을 한 번 당겨옴(성공 시 write가 이벤트를 발행 → sync로 반영)
    void pullOrgFromServer()
    return () => {
      window.removeEventListener(ORG_SETTINGS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  // 로컬 캐시(즉시 반영) 후 서버에 부서+위치 전체를 저장합니다.
  const setDivisions = useCallback((next: Division[]) => {
    writeDivisions(next)
    return pushOrgToServer(next, readLocations())
  }, [])

  const setLocations = useCallback((next: string[]) => {
    writeLocations(next)
    return pushOrgToServer(readDivisions(), next)
  }, [])

  const resetDivisionsToDefault = useCallback(() => {
    resetDivisions()
    return pushOrgToServer(DEFAULT_DIVISIONS, readLocations())
  }, [])

  const resetLocationsToDefault = useCallback(() => {
    resetLocations()
    return pushOrgToServer(readDivisions(), DEFAULT_LOCATIONS)
  }, [])

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
