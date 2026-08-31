import { Card } from '@/components/ui'
import type { AcquisitionSplit, RentalCompanyDatum } from '../types'
import './RentalStatusPanel.css'

/** {@link RentalStatusPanel} 컴포넌트 props. */
interface RentalStatusPanelProps {
  /** 구매/렌탈 집계. */
  acquisition: AcquisitionSplit
  /** 렌탈사별 집계. */
  rentalByCompany: RentalCompanyDatum[]
  /** 진행중 렌탈 월 비용 총합(원). */
  rentalMonthlyTotal?: number
}

/**
 * 취득 구분(구매/렌탈) + 렌탈사별 현황 위젯.
 * 회사는 자산을 구매/렌탈 혼용하므로 대시보드에서 별도로 구분해 보여줍니다.
 *
 * @param props - {@link RentalStatusPanelProps}
 * @returns 렌탈 현황 카드
 */
export default function RentalStatusPanel({
  acquisition,
  rentalByCompany,
  rentalMonthlyTotal,
}: RentalStatusPanelProps) {
  const total = acquisition.purchase + acquisition.rental
  const rentalPercent = total ? Math.round((acquisition.rental / total) * 100) : 0

  return (
    <Card title="취득 구분 (구매 / 렌탈)">
      <div className="rental-split">
        <div className="rental-box purchase">
          <span className="rental-num">{acquisition.purchase.toLocaleString('ko-KR')}</span>
          <span className="rental-label">구매</span>
        </div>
        <div className="rental-box rental">
          <span className="rental-num">{acquisition.rental.toLocaleString('ko-KR')}</span>
          <span className="rental-label">렌탈 ({rentalPercent}%)</span>
        </div>
      </div>

      {/* 진행중 렌탈 월 비용 총합 */}
      {rentalMonthlyTotal != null && rentalMonthlyTotal > 0 && (
        <div className="rental-cost-total">
          <span>월 렌탈 비용</span>
          <strong>{rentalMonthlyTotal.toLocaleString('ko-KR')}원/월</strong>
        </div>
      )}

      <div className="rental-company-title">렌탈사별</div>
      <ul className="rental-company-list">
        {rentalByCompany.length === 0 && <li className="rental-empty">렌탈 자산이 없습니다.</li>}
        {rentalByCompany.map((r) => (
          <li key={r.company}>
            <span>{r.company}</span>
            <strong>
              {r.count.toLocaleString('ko-KR')}대
              {r.cost ? <span className="rental-company-cost"> · {r.cost.toLocaleString('ko-KR')}원/월</span> : null}
            </strong>
          </li>
        ))}
      </ul>
    </Card>
  )
}
