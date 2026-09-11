import { Inbox } from 'lucide-react'
import { Card, Badge, type BadgeVariant } from '@/components/ui'
import EmptyState from '@/components/feedback/EmptyState'
import type { RequestItem } from '../types'
import './RequestStatusPanel.css'

/** {@link RequestStatusPanel} 컴포넌트 props. */
interface RequestStatusPanelProps {
  /** 신청 현황 목록(실데이터 `6_신청기록` 최신). */
  requests: RequestItem[]
}

/**
 * 신청 상태 문자열 → 뱃지 색상. 실데이터(접수/처리중/완료/반려) 및 과거 표기 모두 수용.
 * @param status - 상태 문자열
 * @returns 뱃지 색상 변형
 */
function statusVariant(status: string): BadgeVariant {
  if (status === '완료' || status === '승인 완료') return 'success'
  if (status === '처리중' || status === '처리 중') return 'info'
  if (status === '반려') return 'danger'
  return 'warning' // 접수 / 승인 대기 등
}

/**
 * 신청 현황 목록 위젯. 실데이터 `6_신청기록` 최신 건을 한눈에 보여줍니다.
 * (상세 처리는 신청관리 화면에서)
 *
 * @param props - {@link RequestStatusPanelProps}
 * @returns 신청 현황 카드
 */
export default function RequestStatusPanel({ requests }: RequestStatusPanelProps) {
  return (
    <Card title="신청 현황">
      {requests.length === 0 ? (
        <EmptyState icon={Inbox} title="신청 내역이 없습니다." />
      ) : (
        <ul className="request-list">
          {requests.map((item, i) => (
            <li key={`${item.title}-${i}`} className="request-row">
              <span className="request-kind">{item.kind}</span>
              <span className="request-title">{item.title}</span>
              <span className="request-date">{item.date}</span>
              <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
