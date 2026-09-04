import { DEFAULT_DIVISIONS, DEFAULT_LOCATIONS, type Division } from '@/config/orgDefaults'

/**
 * 조직(부서/사용위치) 설정 저장소.
 * 관리자가 설정 화면에서 수정한 값을 localStorage에 오버라이드로 저장하고,
 * 변경 이벤트로 사이드바/폼 셀렉트가 즉시 반영되게 합니다. ([[moduleVisibility]]와 동일 패턴)
 * 서버(시트) 저장은 추후 확장 지점.
 */

const DIVISIONS_KEY = 'smc.org.divisions'
const LOCATIONS_KEY = 'smc.org.locations'

/** 조직 설정 변경 알림 이벤트명. */
export const ORG_SETTINGS_EVENT = 'smc:org-settings'

/** localStorage에서 JSON을 안전하게 읽습니다. 실패 시 fallback 반환. */
function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/** localStorage에 저장하고 변경 이벤트를 발행합니다. */
function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 저장 실패(사생활 모드 등)는 무시 — 이벤트만 발행해 화면은 갱신
  }
  window.dispatchEvent(new Event(ORG_SETTINGS_EVENT))
}

/** 저장된 부서(본부→팀) 구조를 읽습니다. 없으면 기본값. */
export function readDivisions(): Division[] {
  return readJson<Division[]>(DIVISIONS_KEY, DEFAULT_DIVISIONS)
}

/** 부서 구조를 저장합니다. */
export function writeDivisions(divisions: Division[]): void {
  writeJson(DIVISIONS_KEY, divisions)
}

/** 부서 구조를 기본값으로 되돌립니다. */
export function resetDivisions(): void {
  writeJson(DIVISIONS_KEY, DEFAULT_DIVISIONS)
}

/** 저장된 사용위치 목록을 읽습니다. 없으면 기본값. */
export function readLocations(): string[] {
  return readJson<string[]>(LOCATIONS_KEY, DEFAULT_LOCATIONS)
}

/** 사용위치 목록을 저장합니다. */
export function writeLocations(locations: string[]): void {
  writeJson(LOCATIONS_KEY, locations)
}

/** 사용위치를 기본값으로 되돌립니다. */
export function resetLocations(): void {
  writeJson(LOCATIONS_KEY, DEFAULT_LOCATIONS)
}

/**
 * 부서 구조(본부→팀)를 셀렉트 옵션용 평탄 배열로 변환합니다.
 * 팀명을 그대로 옵션 값으로 사용합니다(대부분 본부 접두사가 포함되어 식별 가능).
 * @param divisions - 부서 구조
 * @returns 팀명 평탄 배열(중복 제거)
 */
export function flattenDivisions(divisions: Division[]): string[] {
  const flat: string[] = []
  divisions.forEach((d) => d.teams.forEach((t) => flat.push(t)))
  return Array.from(new Set(flat.filter((t) => t.trim() !== '')))
}
