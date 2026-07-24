/**
 * 자산 제조사 목록. 신청/등록 폼의 선택 옵션이자 통계 분류 기준입니다.
 *
 * `as const`로 선언해 값을 리터럴로 고정하고, 아래 {@link Manufacturer}
 * 유니온 타입을 이 배열에서 자동 파생시킵니다.
 * → 옵션을 여기 한 곳만 수정하면 타입과 UI가 함께 갱신됩니다.
 */
export const MANUFACTURERS = ['SAMSUNG', 'LG', 'LENOVO', 'HP', 'APPLE'] as const

/** 제조사 유니온 타입 (예: 'SAMSUNG' | 'LG' | ...). */
export type Manufacturer = (typeof MANUFACTURERS)[number]
