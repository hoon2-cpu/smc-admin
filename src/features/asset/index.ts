import { lazy } from 'react'
import { Monitor } from 'lucide-react'
import type { ModuleDef } from '@/app/types'

/**
 * 자산관리 모듈 정의.
 * 진입 페이지는 자산 목록/현황이며, 등록은 페이지 내 모달로 처리합니다.
 */
export const assetModule: ModuleDef = {
  id: 'asset',
  title: '자산관리',
  path: 'assets',
  icon: Monitor,
  element: lazy(() => import('./AssetListPage')),
  order: 3,
}
