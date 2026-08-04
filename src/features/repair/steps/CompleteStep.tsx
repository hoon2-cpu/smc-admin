import { CheckCircle2, Clock } from 'lucide-react'
import { Badge } from '@/components/ui'
import { getRepairStatusVariant } from '@/lib/badgeVariant'
import AiBotPanel from '../components/AiBotPanel'
import type { RepairFormValues } from '../formConfig'
import './CompleteStep.css'

/** {@link CompleteStep} 컴포넌트 props. */
interface CompleteStepProps {
  /** 발급된 접수번호. */
  ticketNumber: string
  /** 제출된 폼 값 (요약 표시용). */
  values: RepairFormValues
  /** '새 요청' 클릭 시 초기화 콜백. */
  onReset: () => void
}

/**
 * 3단계 — 접수 완료. (이미지 ③ 우측)
 * 접수번호, 접수 정보 요약, Slack 안내, AI 봇을 표시합니다.
 *
 * @param props - {@link CompleteStepProps}
 * @returns 접수 완료 스텝
 */
export default function CompleteStep({ ticketNumber, values, onReset }: CompleteStepProps) {
  return (
    <div className="complete-step">
      <div className="complete-hero">
        <CheckCircle2 size={56} className="complete-check" />
        <h2>수리 요청이 접수되었습니다!</h2>
        <p>접수번호를 확인해주세요.</p>
      </div>

      <div className="ticket-box">
        <span>접수번호</span>
        <strong>{ticketNumber}</strong>
      </div>

      <div className="response-note">
        <Clock size={16} />
        <div>
          담당자가 확인 후 빠르게 연락드리겠습니다.
          <small>평균 응답 시간: 2시간 이내 (업무 시간 기준)</small>
        </div>
      </div>

      <dl className="summary">
        <div>
          <dt>접수 유형</dt>
          <dd>수리 요청</dd>
        </div>
        <div>
          <dt>자산 정보</dt>
          <dd>
            {values.assetNumber} {values.assetName && `(${values.assetName})`}
          </dd>
        </div>
        <div>
          <dt>증상</dt>
          <dd>{values.symptom || '-'}</dd>
        </div>
        <div>
          <dt>긴급도</dt>
          <dd>
            <Badge variant={getRepairStatusVariant('접수')}>{values.priority}</Badge>
          </dd>
        </div>
        <div>
          <dt>첨부 파일</dt>
          <dd>{values.photos.length}장</dd>
        </div>
      </dl>

      <div className="slack-note">
        <strong>Slack으로 안내드릴게요</strong>
        <span>접수 진행 상황은 Slack DM으로 안내드리며, 문의가 필요하시면 언제든 메시지 주세요!</span>
      </div>

      <AiBotPanel />

      <button type="button" className="new-request-btn" onClick={onReset}>
        새 요청 작성
      </button>
    </div>
  )
}
