import { lazy } from 'react'
import { ShoppingCart } from 'lucide-react'
import type { ModuleDef } from '@/app/types'

/** 구매·정산관리 모듈 정의. */
export const purchaseModule: ModuleDef = {
  id: 'purchase',
  title: '구매·정산관리',
  path: 'purchase',
  icon: ShoppingCart,
  element: lazy(() => import('./PurchasePage')),
  // 나중에 구현 예정 — 지금은 사이드바에서 숨김 (이 줄 제거 시 다시 노출)
  showInSidebar: false,
  order: 2,
}
