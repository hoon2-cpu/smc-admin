import AppShell from '@/components/layout/AppShell'
import StatCardRow from './widgets/StatCardRow'
import AssetCategoryChart from './widgets/AssetCategoryChart'
import RequestStatusPanel from './widgets/RequestStatusPanel'
import LowStockPanel from './widgets/LowStockPanel'
import RecentAssetsTable from './widgets/RecentAssetsTable'
import DisposalScheduleTable from './widgets/DisposalScheduleTable'
import QuickLinks from './widgets/QuickLinks'
import './AdminDashboardPage.css'

/**
 * 관리자 대시보드 페이지. (이미지 ④)
 * 레이아웃(AppShell) 위에 통계/차트/목록 위젯들을 배치만 합니다.
 * 각 위젯은 자체 데이터를 갖고 있어, 이 페이지는 "조립"만 담당합니다.
 *
 * @returns 관리자 대시보드 페이지
 */
export default function AdminDashboardPage() {
  return (
    <AppShell title="대시보드" notificationCount={12}>
      <StatCardRow />

      {/* 자산현황(차트) · 신청현황 · 소모품재고 3단 배치 */}
      <div className="dash-grid dash-grid-3">
        <AssetCategoryChart />
        <RequestStatusPanel />
        <LowStockPanel />
      </div>

      {/* 최근 등록 자산 · 폐기 예정 2단 배치 */}
      <div className="dash-grid dash-grid-2">
        <RecentAssetsTable />
        <DisposalScheduleTable />
      </div>

      <QuickLinks />
    </AppShell>
  )
}
