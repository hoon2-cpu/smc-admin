import { lazy } from 'react'
import { Database } from 'lucide-react'
import type { ModuleDef } from '@/app/types'

/** 코드(Master)관리 모듈 정의. */
export const masterModule: ModuleDef = {
  id: 'master',
  title: '코드(Master)관리',
  path: 'master',
  icon: Database,
  element: lazy(() => import('./MasterPage')),
  order: 6,
}
