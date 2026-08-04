import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'
import { MODULES } from './registry'

/**
 * 앱 라우트.
 * 모듈 레지스트리(MODULES)로부터 `/admin/<path>` 라우트를 자동 생성합니다.
 * → 새 모듈은 registry에 등록만 하면 라우트가 함께 생깁니다.
 *
 * @returns 라우트 트리
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* 진입점: 관리자 대시보드로 이동 */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* 공통 레이아웃 하위에 모듈 페이지들을 중첩 */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        {MODULES.map((module) => {
          const ModuleElement = module.element
          return <Route key={module.id} path={module.path} element={<ModuleElement />} />
        })}
      </Route>

      {/* 그 외 경로는 대시보드로 */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}
