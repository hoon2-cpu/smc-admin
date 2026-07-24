import { describe, it, expect } from 'vitest'
import { formatTicketNumber } from './ticketNumber'

describe('formatTicketNumber', () => {
  it('R-YYYY-MMDD-#### 형식으로 생성한다', () => {
    // 2024-05-17 (month 인덱스는 0부터이므로 4 = 5월)
    expect(formatTicketNumber(new Date(2024, 4, 17), 1)).toBe('R-2024-0517-0001')
  })

  it('월/일/순번을 0으로 패딩한다', () => {
    expect(formatTicketNumber(new Date(2024, 0, 3), 42)).toBe('R-2024-0103-0042')
  })
})
