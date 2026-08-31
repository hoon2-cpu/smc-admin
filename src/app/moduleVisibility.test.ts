import { describe, it, expect } from 'vitest'
import { isModuleVisible } from './moduleVisibility'
import type { ModuleDef } from './types'

/** 테스트용 최소 모듈 정의 생성. */
function mod(id: string, showInSidebar?: boolean): ModuleDef {
  return { id, showInSidebar } as unknown as ModuleDef
}

describe('isModuleVisible', () => {
  it('필수 모듈(dashboard/settings)은 오버라이드가 false여도 항상 표시', () => {
    expect(isModuleVisible(mod('dashboard'), { dashboard: false })).toBe(true)
    expect(isModuleVisible(mod('settings'), { settings: false })).toBe(true)
  })

  it('오버라이드가 있으면 기본값보다 우선한다', () => {
    expect(isModuleVisible(mod('asset'), { asset: false })).toBe(false)
    expect(isModuleVisible(mod('asset', false), { asset: true })).toBe(true)
  })

  it('오버라이드가 없으면 기본값(showInSidebar)을 따른다', () => {
    expect(isModuleVisible(mod('asset'), {})).toBe(true)
    expect(isModuleVisible(mod('asset', false), {})).toBe(false)
  })
})
