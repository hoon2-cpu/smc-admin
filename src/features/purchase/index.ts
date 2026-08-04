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
  order: 2,
}
