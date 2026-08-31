/**
 * 직원 신청(자산/반납/소모품) 도메인 상수.
 * 구글시트 `6_신청기록`의 '종류'·'상태' 열 값과 문자열이 일치해야 하므로,
 * 옵션 추가 시 이곳과 GAS(Code.gs)를 함께 수정합니다.
 */

/** 신청 종류. GAS handleXxxRequest_가 기록하는 '종류' 값과 동일해야 합니다. */
export const REQUEST_KINDS = ['자산신청', '반납신청', '소모품신청'] as const

/** 신청 종류 유니온 타입. */
export type RequestKind = (typeof REQUEST_KINDS)[number]

/** 신청 처리 상태(총무팀 관점). 생애주기: 접수 → 처리중 → 완료/반려. */
export const REQUEST_STATUSES = ['접수', '처리중', '완료', '반려'] as const

/** 신청 처리 상태 유니온 타입. */
export type RequestStatus = (typeof REQUEST_STATUSES)[number]

/**
 * 처리 방법. 총무팀이 신청을 어떻게 처리했는지 구분합니다.
 * (소모품: 재고지급/구매요청/외부업체전달[카트리지] · 자산: 구매요청/재고지급 등)
 */
export const PROCESS_METHODS = ['재고지급', '구매요청', '외부업체전달', '기타'] as const

/** 처리 방법 유니온 타입. */
export type ProcessMethod = (typeof PROCESS_METHODS)[number]
