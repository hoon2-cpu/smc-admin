import RoleShell from '@/components/layout/RoleShell'
import { Badge } from '@/components/ui'
import { getRepairStatusVariant } from '@/lib/badgeVariant'
import { useVendorRepairs } from './useVendorRepairs'
import './VendorPage.css'

/**
 * 외부 수리업체용 페이지.
 * 총무팀이 '외부업체 전달'한 수리 건만 목록으로 보여줍니다. (읽기 전용, 모바일 우선)
 *
 * @returns 외부업체 페이지
 */
export default function VendorPage() {
  const { repairs, loading, usingMock } = useVendorRepairs()

  return (
    <RoleShell title="외부 수리업체">
      {loading && <p className="vendor-notice">목록 불러오는 중…</p>}
      {!loading && usingMock && (
        <p className="vendor-notice">샘플(mock) 데이터 표시 중 — 구글시트 연동(재배포) 후 실제 전달 건이 표시됩니다.</p>
      )}

      <p className="vendor-desc">총무팀이 전달한 수리 요청 목록입니다. ({repairs.length}건)</p>

      <div className="vendor-list">
        {repairs.length === 0 && <p className="vendor-empty">전달된 수리 요청이 없습니다.</p>}
        {repairs.map((r) => (
          <div key={r.ticketNumber} className="vendor-card">
            <div className="vendor-card-head">
              <strong>{r.ticketNumber}</strong>
              <Badge variant={getRepairStatusVariant(r.status)}>{r.status}</Badge>
            </div>
            <div className="vendor-card-asset">
              {r.assetNumber} {r.assetName && `· ${r.assetName}`}
            </div>
            <div className="vendor-card-symptom">{r.symptom}</div>
            <div className="vendor-card-meta">
              접수일 {r.receivedAt} · 우선순위 {r.priority}
              {r.assignee && ` · 담당 ${r.assignee}`}
            </div>
          </div>
        ))}
      </div>
    </RoleShell>
  )
}
