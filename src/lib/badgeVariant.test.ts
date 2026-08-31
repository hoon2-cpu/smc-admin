import { describe, it, expect } from 'vitest'
import {
  getAssetStatusVariant,
  getRepairStatusVariant,
  getRequestStatusVariant,
} from './badgeVariant'

describe('getAssetStatusVariant', () => {
  it('사용중은 success', () => {
    expect(getAssetStatusVariant('사용중')).toBe('success')
  })
  it('수리중은 warning', () => {
    expect(getAssetStatusVariant('수리중')).toBe('warning')
  })
  it('폐기예정은 danger', () => {
    expect(getAssetStatusVariant('폐기예정')).toBe('danger')
  })
})

describe('getRepairStatusVariant', () => {
  it('접수는 info', () => {
    expect(getRepairStatusVariant('접수')).toBe('info')
  })
  it('완료는 success', () => {
    expect(getRepairStatusVariant('완료')).toBe('success')
  })
})

describe('getRequestStatusVariant', () => {
  it('접수는 info', () => {
    expect(getRequestStatusVariant('접수')).toBe('info')
  })
  it('처리중은 warning', () => {
    expect(getRequestStatusVariant('처리중')).toBe('warning')
  })
  it('완료는 success', () => {
    expect(getRequestStatusVariant('완료')).toBe('success')
  })
  it('반려는 danger', () => {
    expect(getRequestStatusVariant('반려')).toBe('danger')
  })
})
