/**
 * 변경 로그의 구분. 어떤 종류의 데이터가 바뀌었는지 나타냅니다.
 */
export type ChangeLogType = '수리접수' | '자산변경'

/**
 * 변경 이력 1건. 구글시트 `3_변경로그` 시트의 한 행에 대응합니다.
 * 모든 상태 변경을 시간순으로 기록해 추적성을 확보하는 것이 목적입니다.
 */
export interface ChangeLog {
  /** 변경 일시 (ISO datetime). */
  changedAt: string
  /** 변경 구분. */
  type: ChangeLogType
  /** 변경한 사람. */
  changedBy: string
  /** 대상 식별자 (자산번호 또는 접수번호). */
  targetNumber: string
  /** 변경된 항목명 (예: '진행상태', '자산 상태'). */
  field: string
  /** 이전 값. */
  before: string
  /** 이후 값. */
  after: string
  /** 비고. */
  note: string
}
