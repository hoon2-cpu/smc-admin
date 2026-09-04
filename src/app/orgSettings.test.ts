import { describe, it, expect } from 'vitest'
import { flattenDivisions } from './orgSettings'
import type { Division } from '@/config/orgDefaults'

describe('flattenDivisions', () => {
  it('본부별 팀을 하나의 평탄 배열로 만든다', () => {
    const divs: Division[] = [
      { name: '경영본부', teams: ['총무팀', '자금팀'] },
      { name: 'AI Labs', teams: ['AI Labs팀'] },
    ]
    expect(flattenDivisions(divs)).toEqual(['총무팀', '자금팀', 'AI Labs팀'])
  })

  it('빈 팀명은 제거하고 중복은 한 번만 남긴다', () => {
    const divs: Division[] = [
      { name: 'A본부', teams: ['공용팀', ''] },
      { name: 'B본부', teams: ['공용팀', '  '] },
    ]
    expect(flattenDivisions(divs)).toEqual(['공용팀'])
  })
})
