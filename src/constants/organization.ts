/**
 * 자산이 위치한 사옥. 분출/반납/구매 신청 시 선택합니다.
 */
export const BUILDINGS = ['1사옥', '2사옥'] as const

/** 사옥 유니온 타입. */
export type Building = (typeof BUILDINGS)[number]

/**
 * 소속 부서 목록. 신청자/사용자의 부서 선택 옵션입니다.
 * 실제 조직도에 맞게 이 배열만 수정하면 전체에 반영됩니다.
 */
export const DEPARTMENTS = [
  '경영지원팀',
  '마케팅팀',
  '개발팀',
  '영업팀',
  '기획팀',
  'IT관리팀',
] as const

/** 부서 유니온 타입. */
export type Department = (typeof DEPARTMENTS)[number]
