import { DEFAULT_DIVISIONS, DEFAULT_LOCATIONS, type Division } from '@/config/orgDefaults'
import { getFromGas, isMockMode, submitToGas, type GasResult } from '@/lib/gasClient'

/**
 * 조직(부서/사용위치) 설정 저장소.
 * 관리자가 설정 화면에서 수정한 값을 **서버(구글시트 `8_조직설정`)에 저장**하고
 * localStorage에 캐시합니다. 변경 이벤트로 사이드바/폼 셀렉트가 즉시 반영됩니다.
 * → 서버 저장이라 여러 기기/사용자가 같은 조직 구성을 공유합니다.
 * (localStorage는 오프라인/초기 렌더용 캐시 + mock 모드 폴백)
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

// ===== 서버(시트) 동기화 =====

/** GAS `?action=orgSettings` 응답 형식. */
interface OrgSettingsResponse {
  ok?: boolean
  org?: { divisions?: Division[]; locations?: string[] } | null
}

/** 서버 조회 중복 방지용(여러 훅 인스턴스가 한 번만 fetch 하도록 공유). */
let pullInflight: Promise<boolean> | null = null
let pulledOnce = false

/**
 * 서버(시트)에서 조직 설정을 한 번 불러와 localStorage 캐시에 반영합니다.
 * 여러 컴포넌트가 useOrgSettings를 써도 실제 요청은 1회만 나갑니다.
 * @returns 서버 데이터로 갱신했으면 true
 */
export function pullOrgFromServer(): Promise<boolean> {
  if (isMockMode() || pulledOnce) return Promise.resolve(false)
  if (pullInflight) return pullInflight
  pullInflight = (async () => {
    try {
      const json = (await getFromGas({ action: 'orgSettings' })) as OrgSettingsResponse | null
      pulledOnce = true
      if (json && json.ok && json.org) {
        // 서버 값이 있으면 로컬 캐시에 반영(각 write가 변경 이벤트를 발행 → 구독 컴포넌트 갱신)
        if (Array.isArray(json.org.divisions)) writeJson(DIVISIONS_KEY, json.org.divisions)
        if (Array.isArray(json.org.locations)) writeJson(LOCATIONS_KEY, json.org.locations)
        return true
      }
      return false
    } catch {
      pulledOnce = true
      return false
    } finally {
      pullInflight = null
    }
  })()
  return pullInflight
}

/**
 * 조직 설정(부서+사용위치)을 서버(시트)에 저장합니다.
 * @param divisions - 부서 구조
 * @param locations - 사용위치 목록
 * @returns 서버 응답 (mock 모드면 로컬만 사용하고 ok)
 */
export function pushOrgToServer(divisions: Division[], locations: string[]): Promise<GasResult> {
  if (isMockMode()) return Promise.resolve({ ok: true })
  return submitToGas('orgSettingsUpdate', { divisions, locations })
}
