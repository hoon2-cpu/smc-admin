import { useState } from 'react'
import RoleShell from '@/components/layout/RoleShell'
import RepairRequestPage from '@/features/repair/RepairRequestPage'
import AssetRequestForm from './AssetRequestForm'
import ReturnRequestForm from './ReturnRequestForm'
import ConsumableRequestForm from './ConsumableRequestForm'
import './RequestPage.css'

/** 신청 탭 종류. */
const TABS = ['자산신청', '소모품신청', '수리신청', '반납신청'] as const
type RequestTab = (typeof TABS)[number]

/**
 * 일반 직원용 신청 페이지.
 * 자산신청 / 수리신청(기존 폼 재사용) / 반납신청을 탭으로 제공합니다. (모바일 우선)
 *
 * @returns 직원 신청 페이지
 */
export default function RequestPage() {
  const [tab, setTab] = useState<RequestTab>('자산신청')

  return (
    <RoleShell title="직원 신청">
      <div className="req-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={t === tab ? 'req-tab active' : 'req-tab'}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === '자산신청' && <AssetRequestForm />}
      {tab === '소모품신청' && <ConsumableRequestForm />}
      {tab === '수리신청' && <RepairRequestPage />}
      {tab === '반납신청' && <ReturnRequestForm />}
    </RoleShell>
  )
}
