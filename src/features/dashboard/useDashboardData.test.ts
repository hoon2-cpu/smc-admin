import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDashboardData } from './useDashboardData'
import { DASHBOARD_MOCK } from './mock/dashboardMock'

// 실데이터 조회를 항상 null(미배포/데이터 없음)로 모킹 → mock 폴백 경로 검증
vi.mock('./api', () => ({ fetchDashboard: vi.fn(async () => null) }))

describe('useDashboardData', () => {
  it('실데이터가 없으면 mock으로 폴백한다', async () => {
    const { result } = renderHook(() => useDashboardData())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.usingMock).toBe(true)
    expect(result.current.data).toEqual(DASHBOARD_MOCK)
  })
})
