import { lazy } from 'react'
import { Wrench } from 'lucide-react'
import type { ModuleDef } from '@/app/types'

/** 수리관리 모듈 정의. */
export const repairModule: ModuleDef = {
  id: 'repair',
  title: '수리관리',
  path: 'repair',
  icon: Wrench,
  element: lazy(() => import('./RepairRequestPage')),
  order: 5,
}
