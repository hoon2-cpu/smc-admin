import { lazy } from 'react'
import { Package } from 'lucide-react'
import type { ModuleDef } from '@/app/types'

/** 소모품관리 모듈 정의. */
export const consumableModule: ModuleDef = {
  id: 'consumable',
  title: '소모품관리',
  path: 'consumables',
  icon: Package,
  element: lazy(() => import('./ConsumablePage')),
  order: 4,
}
