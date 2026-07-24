/**
 * 자산 구분(카테고리) 목록. 관리자 대시보드의 도넛 차트 분류 기준입니다.
 */
export const ASSET_CATEGORIES = ['노트북', '모니터', '데스크탑', '프린터', '기타'] as const

/** 자산 구분 유니온 타입. */
export type AssetCategory = (typeof ASSET_CATEGORIES)[number]

/**
 * 자산 상태 값. 자산의 생애주기(사용 → 수리 → 폐기)를 나타냅니다.
 */
export const ASSET_STATUSES = ['사용중', '사용가능', '수리중', '폐기예정', '폐기'] as const

/** 자산 상태 유니온 타입. */
export type AssetStatus = (typeof ASSET_STATUSES)[number]
