import { useMemo, useState } from 'react'
import { Inbox, Clock, CheckCircle2 } from 'lucide-react'
import { StatCard, Card, Badge } from '@/components/ui'
import { getRequestStatusVariant } from '@/lib/badgeVariant'
import { REQUEST_KINDS } from '@/constants/request'
import { useRequests } from './useRequests'
import RequestDetailModal from './RequestDetailModal'
import type { RequestRow } from './types'
import './RequestManagePage.css'

/** 종류 필터 탭 값('전체' + 신청 종류). */
const KIND_TABS = ['전체', ...REQUEST_KINDS] as const
type KindTab = (typeof KIND_TABS)[number]

/**
 * 총무팀 신청관리 페이지.
 * 직원이 넣은 자산/반납/소모품 신청(`6_신청기록`)을 목록으로 보고,
 * 행을 클릭해 상태·처리방법·메모를 처리(승인/구매/재고지급/외부전달)합니다.
 *
 * @returns 신청관리 페이지
 */
export default function RequestManagePage() {
  const { requests, loading, usingMock, patchRequest } = useRequests()
  const [tab, setTab] = useState<KindTab>('전체')
  const [selected, setSelected] = useState<RequestRow | null>(null)

  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === '접수').length,
    [requests],
  )
  const inProgressCount = useMemo(
    () => requests.filter((r) => r.status === '처리중').length,
    [requests],
  )
  const doneCount = useMemo(
    () => requests.filter((r) => r.status === '완료').length,
    [requests],
  )

  const filtered = useMemo(
    () => (tab === '전체' ? requests : requests.filter((r) => r.kind === tab)),
    [requests, tab],
  )

  return (
    <>
      {loading && <p className="req-notice">신청 목록 불러오는 중…</p>}
      {!loading && usingMock && (
        <p className="req-notice">
          샘플(mock) 데이터 표시 중 — GAS 재배포(v14-requests) 후 실제 신청이 표시됩니다.
        </p>
      )}

      <div className="req-stat-row">
        <StatCard label="접수 대기" value={pendingCount} unit="건" tone="blue" icon={<Inbox size={22} />} />
        <StatCard label="처리중" value={inProgressCount} unit="건" tone="orange" icon={<Clock size={22} />} />
        <StatCard label="완료" value={doneCount} unit="건" tone="green" icon={<CheckCircle2 size={22} />} />
      </div>

      <Card title="신청 목록">
        <div className="req-tabs">
          {KIND_TABS.map((k) => (
            <button
              key={k}
              type="button"
              className={`req-tab ${tab === k ? 'active' : ''}`}
              onClick={() => setTab(k)}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="req-table-scroll">
          <table className="req-table">
            <thead>
              <tr>
                <th>신청일</th>
                <th>종류</th>
                <th>신청자</th>
                <th>대상</th>
                <th>사유</th>
                <th>상태</th>
                <th>처리방법</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="req-empty">
                    신청 내역이 없습니다.
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.rowIndex} className="req-row" onClick={() => setSelected(r)}>
                  <td>{r.requestedAt}</td>
                  <td>{r.kind}</td>
                  <td>
                    {r.requester}
                    {r.department && <span className="req-dept"> · {r.department}</span>}
                  </td>
                  <td>
                    {r.target || '-'}
                    {r.assetNumber && <span className="req-dept"> ({r.assetNumber})</span>}
                  </td>
                  <td className="req-reason">{r.reason || '-'}</td>
                  <td>
                    <Badge variant={getRequestStatusVariant(r.status)}>{r.status}</Badge>
                  </td>
                  <td>{r.method || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <RequestDetailModal
          key={selected.rowIndex}
          request={selected}
          onClose={() => setSelected(null)}
          onSaved={(row) => patchRequest(row)}
        />
      )}
    </>
  )
}
