import { lazy } from 'react'
import { Monitor } from 'lucide-react'
import type { ModuleDef } from '@/app/types'

/**
 * 자산관리 모듈 정의.
 * 현재 진입 페이지는 자산 등록 화면이며, 9단계에서 목록/현황 등으로 확장됩니다.
 */
export const assetModule: ModuleDef = {
  id: 'asset',
  title: '자산관리',
  path: 'assets',
  icon: Monitor,
  element: lazy(() => import('./AssetRegisterPage')),
  order: 3,
}
