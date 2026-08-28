import type { AssetStatus } from '@/constants/asset'
import type { Consumable } from '@/types'

/** 자산 구분별 집계 1건 (도넛 차트용). */
export interface CategoryDatum {
  /** 자산 구분명. */
  category: string
  /** 해당 구분의 자산 수. */
  count: number
}

/** 신청 종류. */
export type RequestKind = '자산 신청' | '소모품 신청' | '유지보수 신청' | '구매 신청' | '자산 반납'

/** 신청 진행 상태. */
export type RequestStatus = '승인 대기' | '처리 중' | '승인 완료'

/** 신청 현황 목록의 한 행. */
export interface RequestItem {
  /** 신청 종류. */
  kind: RequestKind
  /** 신청 제목(요약). */
  title: string
  /** 신청일 (YYYY-MM-DD). */
  date: string
  /** 진행 상태. */
  status: RequestStatus
}

/** 최근 등록 자산 목록의 한 행. */
export interface RecentAssetItem {
  /** 자산번호. */
  assetNumber: string
  /** 자산명. */
  name: string
  /** 자산 구분. */
  category: string
  /** 취득일 (YYYY-MM-DD). */
  acquiredDate: string
  /** 사용자(부서 포함 표기). */
  user: string
  /** 자산 상태. */
  status: AssetStatus
}

/** 폐기 예정 자산 목록의 한 행. */
export interface DisposalItem {
  /** 자산번호. */
  assetNumber: string
  /** 자산명. */
  name: string
  /** 취득일 (YYYY-MM-DD). */
  acquiredDate: string
  /** 내용연수(년). */
  usefulLifeYears: number
  /** 폐기 예정일 (YYYY-MM-DD). */
  disposalDate: string
  /** 폐기까지 남은 기준 일수(예: 30 → '30일 이내'). */
  withinDays: number
}

/** 상단 KPI 카드용 핵심 지표. */
export interface DashboardStats {
  /** 전체 자산 수. */
  totalAssets: number
  /** 사용 중 자산 수. */
  inUseAssets: number
  /** 수리 중 자산 수. */
  repairingAssets: number
  /** 폐기 예정 자산 수. */
  disposalPlannedAssets: number
  /** 재고 부족 소모품 종류 수. */
  lowStockCount: number
}

/** 취득 구분(구매/렌탈) 집계. */
export interface AcquisitionSplit {
  /** 구매 자산 수. */
  purchase: number
  /** 렌탈 자산 수. */
  rental: number
}

/** 렌탈사별 집계 1건. */
export interface RentalCompanyDatum {
  /** 렌탈사명. */
  company: string
  /** 해당 렌탈사 자산 수. */
  count: number
}

/** 관리자 대시보드 전체 데이터 묶음. (mock 또는 GAS 응답) */
export interface DashboardData {
  /** 상단 통계. */
  stats: DashboardStats
  /** 자산 구분별 집계. */
  categories: CategoryDatum[]
  /** 취득 구분(구매/렌탈) 집계. */
  acquisition: AcquisitionSplit
  /** 렌탈사별 집계. */
  rentalByCompany: RentalCompanyDatum[]
  /** 신청 현황. */
  requests: RequestItem[]
  /** 소모품 재고 부족. */
  lowStock: Consumable[]
  /** 최근 등록 자산. */
  recentAssets: RecentAssetItem[]
  /** 폐기 예정 자산. */
  disposals: DisposalItem[]
}
