import StatCardRow from './widgets/StatCardRow'
import AssetCategoryChart from './widgets/AssetCategoryChart'
import RequestStatusPanel from './widgets/RequestStatusPanel'
import LowStockPanel from './widgets/LowStockPanel'
import RecentAssetsTable from './widgets/RecentAssetsTable'
import DisposalScheduleTable from './widgets/DisposalScheduleTable'
import RentalStatusPanel from './widgets/RentalStatusPanel'
import RecentChangesPanel from './widgets/RecentChangesPanel'
import QuickLinks from './widgets/QuickLinks'
import LoadingState from '@/components/feedback/LoadingState'
import MockNotice from '@/components/feedback/MockNotice'
import { useDashboardData } from './useDashboardData'
import './AdminDashboardPage.css'

/**
 * 관리자 대시보드 페이지. (이미지 ④)
 * 공통 레이아웃(AdminLayout) 콘텐츠 영역에 렌더링되므로, 이 컴포넌트는
 * 위젯 배치만 담당합니다. useDashboardData 훅에서 데이터를 받아 분배합니다.
 * (mock 모드/미배포/조회 실패 시 mock으로 자동 폴백)
 *
 * @returns 관리자 대시보드 페이지
 */
export default function AdminDashboardPage() {
  const { data, loading, usingMock } = useDashboardData()

  return (
    <>
      {/* 실데이터 조회 중/샘플 데이터 여부를 알리는 배지 */}
      {loading && <LoadingState message="실데이터 불러오는 중…" />}
      {!loading && usingMock && (
        <MockNotice message="샘플(mock) 데이터 표시 중 — 구글시트에 데이터가 쌓이면 자동 반영됩니다." />
      )}

      <StatCardRow stats={data.stats} />

      {/* 섹션1: 현황 요약 (자산 구분 차트 · 신청 현황 · 소모품 재고) */}
      <section className="dash-section">
        <h2 className="dash-section-title">현황 요약</h2>
        <div className="dash-grid dash-grid-3">
          <AssetCategoryChart categories={data.categories} />
          <RequestStatusPanel requests={data.requests} />
          <LowStockPanel items={data.lowStock} />
        </div>
      </section>

      {/* 섹션2: 자산 현황 (취득 구분/렌탈 · 최근 등록 · 폐기 예정) */}
      <section className="dash-section">
        <h2 className="dash-section-title">자산 현황</h2>
        <div className="dash-grid dash-grid-3">
          <RentalStatusPanel
            acquisition={data.acquisition}
            rentalByCompany={data.rentalByCompany}
            rentalMonthlyTotal={data.rentalMonthlyTotal}
          />
          <RecentAssetsTable assets={data.recentAssets} />
          <DisposalScheduleTable items={data.disposals} />
        </div>
      </section>

      {/* 섹션3: 최근 이동 (반납/불출/상태변경 히스토리) */}
      <section className="dash-section">
        <h2 className="dash-section-title">최근 이동</h2>
        <div className="dash-grid">
          <RecentChangesPanel changes={data.recentChanges} />
        </div>
      </section>

      {/* 바로가기 (카드 자체 제목이 라벨 역할) */}
      <QuickLinks />
    </>
  )
}
