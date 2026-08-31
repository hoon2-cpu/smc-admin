import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAssetSelection } from './useAssetSelection'

describe('useAssetSelection', () => {
  it('toggle로 선택/해제를 반복한다', () => {
    const { result } = renderHook(() => useAssetSelection())
    act(() => result.current.toggle('AST-1'))
    expect(result.current.isSelected('AST-1')).toBe(true)
    expect(result.current.count).toBe(1)
    act(() => result.current.toggle('AST-1'))
    expect(result.current.isSelected('AST-1')).toBe(false)
    expect(result.current.count).toBe(0)
  })

  it('toggleAll은 모두 선택돼 있으면 해제, 아니면 전부 선택한다', () => {
    const { result } = renderHook(() => useAssetSelection())
    const all = ['A', 'B', 'C']
    act(() => result.current.toggleAll(all))
    expect(result.current.count).toBe(3)
    act(() => result.current.toggleAll(all))
    expect(result.current.count).toBe(0)
  })

  it('clear로 전체 해제한다', () => {
    const { result } = renderHook(() => useAssetSelection())
    act(() => result.current.toggleAll(['A', 'B']))
    act(() => result.current.clear())
    expect(result.current.count).toBe(0)
  })
})
