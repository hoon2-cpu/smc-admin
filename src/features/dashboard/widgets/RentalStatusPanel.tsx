import { Card } from '@/components/ui'
import type { AcquisitionSplit, RentalCompanyDatum } from '../types'
import './RentalStatusPanel.css'

/** {@link RentalStatusPanel} 컴포넌트 props. */
interface RentalStatusPanelProps {
  /** 구매/렌탈 집계. */
  acquisition: AcquisitionSplit
  /** 렌탈사별 집계. */
  rentalByCompany: RentalCompanyDatum[]
}

/**
 * 취득 구분(구매/렌탈) + 렌탈사별 현황 위젯.
 * 회사는 자산을 구매/렌탈 혼용하므로 대시보드에서 별도로 구분해 보여줍니다.
 *
 * @param props - {@link RentalStatusPanelProps}
 * @returns 렌탈 현황 카드
 */
export default function RentalStatusPanel({ acquisition, rentalByCompany }: RentalStatusPanelProps) {
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

      <div className="rental-company-title">렌탈사별</div>
      <ul className="rental-company-list">
        {rentalByCompany.length === 0 && <li className="rental-empty">렌탈 자산이 없습니다.</li>}
        {rentalByCompany.map((r) => (
          <li key={r.company}>
            <span>{r.company}</span>
            <strong>{r.count.toLocaleString('ko-KR')}대</strong>
          </li>
        ))}
      </ul>
    </Card>
  )
}
