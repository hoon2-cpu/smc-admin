import { lazy } from 'react'
import { Wrench } from 'lucide-react'
import type { ModuleDef } from '@/app/types'

/** 수리관리 모듈 정의. 진입은 접수 목록이며, 수리 접수는 페이지 내 모달로 처리. */
export const repairModule: ModuleDef = {
  id: 'repair',
  title: '수리관리',
  path: 'repair',
  icon: Wrench,
  element: lazy(() => import('./RepairListPage')),
  order: 5,
}
