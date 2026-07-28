import { useMemo, useState } from 'react'
import { Card, Badge, type BadgeVariant } from '@/components/ui'
import type { RequestItem, RequestStatus } from '../types'
import './RequestStatusPanel.css'

/** {@link RequestStatusPanel} 컴포넌트 props. */
interface RequestStatusPanelProps {
  /** 신청 현황 목록. */
  requests: RequestItem[]
}

/** 신청 진행 상태 → 뱃지 색상 매핑. (Record로 누락 방지) */
const STATUS_VARIANT: Record<RequestStatus, BadgeVariant> = {
  '승인 대기': 'warning',
  '처리 중': 'info',
  '승인 완료': 'success',
}

/** 상단 필터 탭 목록. '전체'는 모든 신청을 의미합니다. */
const TABS = ['전체', '자산 신청', '소모품 신청', '유지보수 신청', '구매 신청'] as const

/**
 * 신청 현황 목록 위젯. 탭으로 신청 종류를 필터링합니다. (이미지 ④ '신청 현황')
 *
 * @returns 신청 현황 카드
 */
export default function RequestStatusPanel({ requests }: RequestStatusPanelProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('전체')

  // 탭 또는 데이터가 바뀔 때만 재계산되도록 useMemo로 필터링 결과를 메모이즈합니다.
  const visibleItems = useMemo(
    () => (activeTab === '전체' ? requests : requests.filter((r) => r.kind === activeTab)),
    [activeTab, requests],
  )

  return (
    <Card title="신청 현황">
      <div className="request-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={tab === activeTab ? 'request-tab active' : 'request-tab'}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <ul className="request-list">
        {visibleItems.map((item) => (
          <li key={item.title} className="request-row">
            <span className="request-kind">{item.kind}</span>
            <span className="request-title">{item.title}</span>
            <span className="request-date">{item.date}</span>
            <Badge variant={STATUS_VARIANT[item.status]}>{item.status}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  )
}
