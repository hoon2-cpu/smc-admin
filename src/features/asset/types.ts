import type { AssetStatus } from '@/constants/asset'

/** 자산 목록 표의 한 행. */
export interface AssetRow {
  /** 자산번호. */
  assetNumber: string
  /** 자산명. */
  name: string
  /** 자산 구분. */
  category: string
  /** 제조사. */
  manufacturer: string
  /** 사용자(부서 포함 표기 가능). */
  user: string
  /** 설치 위치(사옥 등). */
  location: string
  /** 자산 상태. */
  status: AssetStatus
  /** 취득일 (YYYY-MM-DD). */
  acquiredDate: string
}

/** 자산 현황 요약(상단 통계 카드). */
export interface AssetSummary {
  /** 전체 자산 수. */
  total: number
  /** 사용 중. */
  inUse: number
  /** 수리 중. */
  repairing: number
  /** 폐기 예정/폐기. */
  disposal: number
}
