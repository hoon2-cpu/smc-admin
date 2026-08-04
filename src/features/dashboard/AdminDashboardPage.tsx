import StatCardRow from './widgets/StatCardRow'
import AssetCategoryChart from './widgets/AssetCategoryChart'
import RequestStatusPanel from './widgets/RequestStatusPanel'
import LowStockPanel from './widgets/LowStockPanel'
import RecentAssetsTable from './widgets/RecentAssetsTable'
import DisposalScheduleTable from './widgets/DisposalScheduleTable'
import QuickLinks from './widgets/QuickLinks'
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
      {loading && <p className="dash-notice">실데이터 불러오는 중…</p>}
      {!loading && usingMock && (
        <p className="dash-notice">샘플(mock) 데이터 표시 중 — 구글시트에 데이터가 쌓이면 자동 반영됩니다.</p>
      )}

      <StatCardRow stats={data.stats} />

      {/* 자산현황(차트) · 신청현황 · 소모품재고 3단 배치 */}
      <div className="dash-grid dash-grid-3">
        <AssetCategoryChart categories={data.categories} />
        <RequestStatusPanel requests={data.requests} />
        <LowStockPanel items={data.lowStock} />
      </div>

      {/* 최근 등록 자산 · 폐기 예정 2단 배치 */}
      <div className="dash-grid dash-grid-2">
        <RecentAssetsTable assets={data.recentAssets} />
        <DisposalScheduleTable items={data.disposals} />
      </div>

      <QuickLinks />
    </>
  )
}
