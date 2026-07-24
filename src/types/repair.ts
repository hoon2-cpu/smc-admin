import type { RepairPriority, RepairStatus } from '@/constants/repair'
import type { Department } from '@/constants/organization'

/**
 * 수리 접수 1건. 구글시트 `1_수리접수기록` 시트의 한 행에 대응합니다.
 * (이미지 ③의 수리 요청 폼 → 완료 화면의 접수 정보와 매칭)
 */
export interface RepairTicket {
  /** 접수번호 (예: 'R-2024-0517-0001'). */
  ticketNumber: string
  /** 접수 일시 (ISO datetime). */
  receivedAt: string
  /** 접수자(요청자) 이름. */
  requesterName: string
  /** 요청자 소속 부서. */
  department: Department
  /** 대상 자산번호. */
  assetNumber: string
  /** 대상 자산명 (표시용 스냅샷). */
  assetName: string
  /** 증상 설명. */
  symptom: string
  /** 우선순위(긴급도). */
  priority: RepairPriority
  /** 첨부 파일 URL 목록 (사진 등, 최대 5장). */
  attachmentUrls: string[]
  /** 진행 상태. */
  status: RepairStatus
  /** 처리 담당자. 미배정 시 빈 문자열. */
  assignee: string
  /** 처리 완료일 (ISO 날짜). 미완료 시 null. */
  completedAt: string | null
}
