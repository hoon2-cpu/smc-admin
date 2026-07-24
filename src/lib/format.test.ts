import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, isLowStock } from './format'

describe('formatCurrency', () => {
  it('천단위 콤마를 추가한다', () => {
    expect(formatCurrency(1690000)).toBe('1,690,000')
  })

  it('0을 그대로 표시한다', () => {
    expect(formatCurrency(0)).toBe('0')
  })
})

describe('formatDate', () => {
  it('ISO 일시에서 날짜만 추출한다', () => {
    expect(formatDate('2024-04-15T10:20:00')).toBe('2024-04-15')
  })

  it('이미 날짜만 있으면 그대로 반환한다', () => {
    expect(formatDate('2024-04-15')).toBe('2024-04-15')
  })
})

describe('isLowStock', () => {
  it('현재 재고가 적정 수량보다 적으면 true', () => {
    expect(isLowStock(3, 77)).toBe(true)
  })

  it('현재 재고가 적정 수량 이상이면 false', () => {
    expect(isLowStock(80, 77)).toBe(false)
  })
})
