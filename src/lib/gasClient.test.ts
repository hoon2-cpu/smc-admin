import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { isMockMode, submitToGas } from './gasClient'

// GAS_URL이 실제 값으로 설정된 상태를 가정하고, fetch를 모킹해 검증합니다.
describe('gasClient', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        json: async () => ({ ok: true, ticketNumber: 'R-TEST-0001' }),
      })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('GAS_URL이 설정되어 실사용 모드다', () => {
    expect(isMockMode()).toBe(false)
  })

  it('요청 본문에 type과 token을 포함해 전송하고 응답을 반환한다', async () => {
    const result = await submitToGas('repairRequest', { symptom: '테스트' })
    expect(result.ok).toBe(true)
    expect(result.ticketNumber).toBe('R-TEST-0001')

    // 전송 본문 검증: type/token이 포함되어야 함
    const mockedFetch = fetch as unknown as ReturnType<typeof vi.fn>
    const requestBody = JSON.parse(mockedFetch.mock.calls[0][1].body)
    expect(requestBody.type).toBe('repairRequest')
    expect(requestBody).toHaveProperty('token')
  })
})
