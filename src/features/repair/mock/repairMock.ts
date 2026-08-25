import type { RepairRow } from '../types'

/**
 * 수리 접수 더미 데이터.
 * 추후 GAS(`?action=repairs`) 연동 시 useRepairs 훅의 실데이터로 대체됩니다.
 */
export const REPAIR_MOCK: RepairRow[] = [
  { ticketNumber: 'R-2024-0517-0001', receivedAt: '2024-05-17', requester: '홍길동', department: '경영지원팀', assetNumber: 'A-2034', assetName: '노트북 (LG gram 16)', symptom: '전원 무반응, 화면 안 켜짐', priority: '높음', status: '접수', assignee: '이관리' },
  { ticketNumber: 'R-2024-0517-0002', receivedAt: '2024-05-17', requester: '김다영', department: '마케팅팀', assetNumber: 'M-1021', assetName: '모니터 (LG 27UL)', symptom: '화면 줄무늬 발생', priority: '보통', status: '수리중', assignee: '박엔지니어' },
  { ticketNumber: 'R-2024-0517-0003', receivedAt: '2024-05-16', requester: '이서연', department: '개발팀', assetNumber: 'P-3005', assetName: '프린터 (HP LaserJet)', symptom: '용지 걸림 반복', priority: '보통', status: '수리중', assignee: '최기술' },
  { ticketNumber: 'R-2024-0516-0007', receivedAt: '2024-05-16', requester: '정민수', department: '영업팀', assetNumber: 'A-2011', assetName: '노트북 (삼성 NT551)', symptom: '블루스크린 발생', priority: '높음', status: '완료', assignee: '이관리' },
  { ticketNumber: 'R-2024-0515-0004', receivedAt: '2024-05-15', requester: '박지훈', department: '경영지원팀', assetNumber: 'K-0902', assetName: '키보드 (로지텍 K120)', symptom: '키 입력 불량', priority: '낮음', status: '완료', assignee: '박엔지니어' },
]
