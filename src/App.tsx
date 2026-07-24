import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '@/features/landing/LandingPage'
import AdminDashboardPage from '@/features/dashboard/AdminDashboardPage'
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

      {/* 직원용 자산관리 화면 (자산등록/수리요청 등) — 다음 단계 구현 */}
      <Route path="/asset" element={<ComingSoon title="자산관리" />} />

      {/* 관리자 대시보드 */}
      <Route path="/admin" element={<AdminDashboardPage />} />

      {/* 정의되지 않은 경로는 메인으로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
