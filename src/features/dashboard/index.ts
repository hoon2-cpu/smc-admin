import { lazy } from 'react'
import { LayoutDashboard } from 'lucide-react'
import type { ModuleDef } from '@/app/types'

/** Dashboard 모듈 정의. */
export const dashboardModule: ModuleDef = {
  id: 'dashboard',
  title: '대시보드',
  path: 'dashboard',
  icon: LayoutDashboard,
  element: lazy(() => import('./AdminDashboardPage')),
  order: 1,
}
