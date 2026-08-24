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
  // 나중에 구현 예정 — 지금은 사이드바에서 숨김 (이 줄 제거 시 다시 노출)
  showInSidebar: false,
  order: 4,
}
