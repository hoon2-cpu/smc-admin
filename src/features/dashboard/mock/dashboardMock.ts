import type { Consumable } from '@/types'
import type { CategoryDatum, DisposalItem, RecentAssetItem, RequestItem } from '../types'

/**
 * 대시보드 더미 데이터.
 * 실제 구글시트 연동(5단계) 전까지 화면을 채우기 위한 목(mock)이며,
 * 이후 이 값들은 커스텀 훅(useDashboardData 등)의 반환으로 대체됩니다.
 */

/** 자산 구분별 집계 (도넛 차트). 합계 1,248대. */
export const CATEGORY_DATA: CategoryDatum[] = [
  { category: '노트북', count: 563 },
  { category: '모니터', count: 320 },
  { category: '데스크탑', count: 198 },
  { category: '프린터', count: 95 },
  { category: '기타', count: 72 },
]

/** 신청 현황 목록. */
export const REQUEST_ITEMS: RequestItem[] = [
  { kind: '자산 신청', title: '노트북 지급 신청 (개발팀 김개발)', date: '2024-05-20', status: '승인 대기' },
  { kind: '소모품 신청', title: '토너 카트리지 신청 (총무팀 이총무)', date: '2024-05-20', status: '승인 대기' },
  { kind: '유지보수 신청', title: '노트북 화면 불량 (영업팀 박영업)', date: '2024-05-19', status: '처리 중' },
  { kind: '구매 신청', title: '27인치 모니터 구매 (개발팀 김개발)', date: '2024-05-19', status: '승인 대기' },
  { kind: '자산 반납', title: '노트북 반납 신청 (퇴사자 정퇴사)', date: '2024-05-18', status: '승인 완료' },
]

/** 소모품 재고 부족 항목. (현재고 < 적정재고) */
export const LOW_STOCK_ITEMS: Consumable[] = [
  { name: '토너 카트리지 (검정)', currentStock: 3, threshold: 77, unit: '개' },
  { name: 'A4 용지', currentStock: 1, threshold: 5, unit: '박스' },
  { name: '볼펜 (검정)', currentStock: 12, threshold: 38, unit: '개' },
  { name: '화이트보드 마커', currentStock: 4, threshold: 16, unit: '개' },
]

/** 최근 등록 자산. */
export const RECENT_ASSETS: RecentAssetItem[] = [
  { assetNumber: 'AST-2024-1248', name: 'MacBook Pro 16', category: '노트북', acquiredDate: '2024-05-20', user: '김개발 (개발팀)', status: '사용중' },
  { assetNumber: 'AST-2024-1247', name: 'LG 27인치 모니터', category: '모니터', acquiredDate: '2024-05-20', user: '이기획 (기획팀)', status: '사용중' },
  { assetNumber: 'AST-2024-1246', name: '삼성 노트북', category: '노트북', acquiredDate: '2024-05-19', user: '박영업 (영업팀)', status: '사용중' },
  { assetNumber: 'AST-2024-1245', name: 'HP 프린터', category: '프린터', acquiredDate: '2024-05-18', user: '총무팀', status: '사용중' },
  { assetNumber: 'AST-2024-1244', name: 'iPhone 15 Pro', category: '기타', acquiredDate: '2024-05-17', user: '최마케팅 (마케팅팀)', status: '사용중' },
]

/** 폐기 예정 자산. */
export const DISPOSAL_ITEMS: DisposalItem[] = [
  { assetNumber: 'AST-2021-0456', name: 'Dell 노트북', acquiredDate: '2021-06-15', usefulLifeYears: 3, disposalDate: '2024-06-15', withinDays: 30 },
  { assetNumber: 'AST-2021-0455', name: 'LG 24인치 모니터', acquiredDate: '2021-07-01', usefulLifeYears: 3, disposalDate: '2024-07-01', withinDays: 60 },
  { assetNumber: 'AST-2021-0342', name: 'HP 데스크탑', acquiredDate: '2021-08-20', usefulLifeYears: 3, disposalDate: '2024-08-20', withinDays: 90 },
  { assetNumber: 'AST-2021-0221', name: '삼성 프린터', acquiredDate: '2021-09-10', usefulLifeYears: 3, disposalDate: '2024-09-10', withinDays: 120 },
]
