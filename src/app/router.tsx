import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'
import { useAuth } from '@/auth/AuthContext'
import { ROLE_HOME } from '@/config/auth'
import RequestPage from '@/features/request/RequestPage'
import VendorPage from '@/features/vendor/VendorPage'
import { MODULES } from './registry'

/**
 * 역할 기반 앱 라우트.
 * 로그인된 역할(총무팀/직원/외부업체)에 따라 접근 가능한 화면만 렌더링하고,
 * 허용되지 않은 경로는 각 역할의 홈으로 보냅니다.
 *
 * @returns 라우트 트리
 */
export default function AppRoutes() {
  const { role } = useAuth()
  // 게이트가 로그인/역할을 보장하지만, 타입 안전을 위해 방어
  if (!role) return null

  const home = ROLE_HOME[role]

  return (
    <Routes>
      <Route path="/" element={<Navigate to={home} replace />} />

      {/* 총무팀: 전체 관리(/admin/*) — 모듈 레지스트리 기반 자동 생성 */}
      {role === 'admin' && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          {MODULES.map((module) => {
            const ModuleElement = module.element
            return <Route key={module.id} path={module.path} element={<ModuleElement />} />
          })}
        </Route>
      )}

      {/* 일반 직원: 신청 폼 */}
      {role === 'employee' && <Route path="/request" element={<RequestPage />} />}

      {/* 외부 수리업체: 전달된 수리 목록 */}
      {role === 'vendor' && <Route path="/vendor" element={<VendorPage />} />}

      {/* 그 외/권한 밖 경로는 역할 홈으로 */}
      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  )
}
