import { Inbox, type LucideIcon } from 'lucide-react'
import './feedback.css'

/** {@link EmptyState} 컴포넌트 props. */
interface EmptyStateProps {
  /** 상단 아이콘. 기본 Inbox. */
  icon?: LucideIcon
  /** 제목(주 메시지). */
  title: string
  /** 보조 안내(선택). */
  hint?: string
}

/**
 * 공통 빈 상태 표시(아이콘 + 제목 + 힌트). 목록/표가 비었을 때 일관되게 사용합니다.
 *
 * @param props - {@link EmptyStateProps}
 * @returns 빈 상태 엘리먼트
 */
export default function EmptyState({ icon: Icon = Inbox, title, hint }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Icon className="empty-icon" size={30} />
      <p className="empty-title">{title}</p>
      {hint && <p className="empty-hint">{hint}</p>}
    </div>
  )
}
