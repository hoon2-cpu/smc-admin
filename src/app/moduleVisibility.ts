import type { ModuleDef } from './types'

/**
 * 사이드바 메뉴(모듈) 표시/숨김을 사용자가 설정 화면에서 제어하기 위한 저장소.
 *
 * @remarks
 * 표시 여부는 두 층으로 결정됩니다.
 * 1) 모듈 기본값(`ModuleDef.showInSidebar`)
 * 2) 사용자가 설정 화면에서 바꾼 오버라이드(localStorage) — 있으면 우선.
 *
 * 서버(시트) 저장은 추후 확장 지점. 지금은 브라우저 로컬에만 저장합니다.
 */

/** localStorage 저장 키. */
const STORAGE_KEY = 'smc.moduleVisibility'

/** 표시 여부 변경을 사이드바 등에 알리는 커스텀 이벤트 이름. */
export const MODULE_VISIBILITY_EVENT = 'smc:module-visibility'

/**
 * 숨길 수 없는 필수 모듈 id.
 * 설정 화면으로 되돌아올 수 있어야 하므로 `settings`, 홈인 `dashboard`는 항상 노출합니다.
 */
export const LOCKED_MODULE_IDS: readonly string[] = ['dashboard', 'settings']

/** 모듈 id → 표시 여부 오버라이드 맵. */
export type VisibilityOverrides = Record<string, boolean>

/**
 * 저장된 표시 여부 오버라이드를 읽습니다.
 * @returns 오버라이드 맵 (없거나 파싱 실패 시 빈 객체)
 */
export function readOverrides(): VisibilityOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as VisibilityOverrides) : {}
  } catch {
    // 로컬스토리지 접근 불가(사생활 모드 등)나 JSON 손상 시 기본값으로 동작
    return {}
  }
}

/**
 * 표시 여부 오버라이드를 저장하고 변경 이벤트를 발행합니다.
 * @param next - 저장할 오버라이드 맵
 */
export function writeOverrides(next: VisibilityOverrides): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // 저장 실패는 무시(표시는 세션 내에서만 유지). 이벤트는 그대로 발행.
  }
  window.dispatchEvent(new Event(MODULE_VISIBILITY_EVENT))
}

/**
 * 특정 모듈의 표시 여부를 오버라이드에 반영합니다. (읽기→병합→저장)
 * @param id - 모듈 id
 * @param visible - 표시 여부
 */
export function setModuleVisibility(id: string, visible: boolean): void {
  writeOverrides({ ...readOverrides(), [id]: visible })
}

/** 모든 오버라이드를 지워 기본값으로 되돌립니다. */
export function resetOverrides(): void {
  writeOverrides({})
}

/**
 * 오버라이드와 기본값을 합쳐 최종 표시 여부를 판정합니다.
 * @param module - 모듈 정의
 * @param overrides - 표시 여부 오버라이드 맵
 * @returns 사이드바에 표시할지 여부
 */
export function isModuleVisible(module: ModuleDef, overrides: VisibilityOverrides): boolean {
  if (LOCKED_MODULE_IDS.includes(module.id)) return true
  const override = overrides[module.id]
  if (typeof override === 'boolean') return override
  return module.showInSidebar !== false
}
