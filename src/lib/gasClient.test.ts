import { describe, it, expect } from 'vitest'
import { isMockMode, submitToGas } from './gasClient'

// GAS_URL 기본값('#') 상태에서의 동작을 검증합니다.
describe('gasClient (mock 모드)', () => {
  it('GAS_URL 미설정 시 mock 모드다', () => {
    expect(isMockMode()).toBe(true)
  })

  it('mock 모드에서는 네트워크 없이 성공을 반환한다', async () => {
    const result = await submitToGas('assetRegister', { name: '노트북' })
    expect(result.ok).toBe(true)
  })
})
