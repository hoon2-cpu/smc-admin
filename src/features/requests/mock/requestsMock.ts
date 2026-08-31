import type { RequestRow } from '../types'

/**
 * 신청 목록 더미 데이터.
 * GAS(`?action=requests`, v14-requests+) 연동 시 useRequests 훅의 실데이터로 대체됩니다.
 */
export const REQUESTS_MOCK: RequestRow[] = [
  {
    rowIndex: 5,
    requestedAt: '2026-08-30',
    kind: '소모품신청',
    requester: '김개발',
    department: '개발팀',
    assetNumber: '',
    target: '토너 카트리지(검정)',
    reason: '사무실 프린터 토너 소진',
    detail: '수량 2',
    status: '접수',
    method: '',
    note: '',
    processedAt: '',
  },
  {
    rowIndex: 4,
    requestedAt: '2026-08-29',
    kind: '자산신청',
    requester: '최마케팅',
    department: '마케팅팀',
    assetNumber: '',
    target: '노트북',
    reason: '신규 입사자 지급',
    detail: 'i7/16GB / 희망일 2026-09-05',
    status: '처리중',
    method: '구매요청',
    note: '아마란스 구매품의 등록함',
    processedAt: '2026-08-30',
  },
  {
    rowIndex: 3,
    requestedAt: '2026-08-28',
    kind: '반납신청',
    requester: '이기획',
    department: '기획팀',
    assetNumber: 'AST-2026-0007',
    target: '모니터 27인치',
    reason: '부서 이동',
    detail: '',
    status: '완료',
    method: '재고지급',
    note: '재고 입고 처리',
    processedAt: '2026-08-29',
  },
]
