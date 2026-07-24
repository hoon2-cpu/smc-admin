import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useForm } from './useForm'

interface SampleForm {
  name: string
  age: string
}

const INITIAL: SampleForm = { name: '', age: '' }

describe('useForm', () => {
  it('초기값을 반환한다', () => {
    const { result } = renderHook(() => useForm(INITIAL))
    expect(result.current.values).toEqual(INITIAL)
  })

  it('setField로 특정 필드만 갱신한다', () => {
    const { result } = renderHook(() => useForm(INITIAL))
    act(() => result.current.setField('name', '홍길동'))
    expect(result.current.values).toEqual({ name: '홍길동', age: '' })
  })

  it('reset으로 초기값으로 되돌린다', () => {
    const { result } = renderHook(() => useForm(INITIAL))
    act(() => result.current.setField('name', '홍길동'))
    act(() => result.current.reset())
    expect(result.current.values).toEqual(INITIAL)
  })
})
