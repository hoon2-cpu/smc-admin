import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '@/features/landing/LandingPage'
import AdminDashboardPage from '@/features/dashboard/AdminDashboardPage'
import EmployeeLayout from '@/components/layout/EmployeeLayout'
import AssetRegisterPage from '@/features/asset/AssetRegisterPage'
import SupportLayout from '@/components/layout/SupportLayout'
import RepairRequestPage from '@/features/repair/RepairRequestPage'
import ComingSoon from '@/components/feedback/ComingSoon'

/**
 * 앱 라우팅 루트.
 * 현재는 메인(랜딩)만 구현되어 있고, 관리자/자산 화면은
 * 다음 단계에서 실제 페이지로 교체될 자리표시(ComingSoon)입니다.
 *
 * @returns 라우트 트리
 */
export default function App() {
  return (
    <Routes>
      {/* 메인 랜딩 페이지 */}
      <Route path="/" element={<LandingPage />} />

      {/* 직원용 자산관리 화면 (모바일 레이아웃 + 하단 탭) */}
      <Route path="/asset" element={<EmployeeLayout />}>
        <Route index element={<Navigate to="register" replace />} />
        <Route path="register" element={<AssetRegisterPage />} />
        {/* 나머지 하단 탭은 다음 단계에서 구현 */}
        <Route path="home" element={<ComingSoon title="대시보드" />} />
        <Route path="list" element={<ComingSoon title="자산 목록" />} />
        <Route path="requests" element={<ComingSoon title="요청 관리" />} />
        <Route path="more" element={<ComingSoon title="더보기" />} />
      </Route>

      {/* IT Support 포털 (수리 요청 등) */}
      <Route path="/support" element={<SupportLayout />}>
        <Route index element={<Navigate to="repair" replace />} />
        <Route path="repair" element={<RepairRequestPage />} />
        {/* 나머지 하단 탭은 다음 단계에서 구현 */}
        <Route path="home" element={<ComingSoon title="홈" />} />
        <Route path="history" element={<ComingSoon title="요청 내역" />} />
        <Route path="asset-info" element={<ComingSoon title="자산 정보" />} />
        <Route path="faq" element={<ComingSoon title="FAQ" />} />
      </Route>

      {/* 관리자 대시보드 */}
      <Route path="/admin" element={<AdminDashboardPage />} />

      {/* 정의되지 않은 경로는 메인으로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
