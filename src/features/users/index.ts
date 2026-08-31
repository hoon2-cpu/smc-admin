import { lazy } from 'react'
import { Users } from 'lucide-react'
import type { ModuleDef } from '@/app/types'

/** 사용자관리 모듈 정의. */
export const usersModule: ModuleDef = {
  id: 'users',
  title: '사용자관리',
  path: 'users',
  icon: Users,
  element: lazy(() => import('./UsersListPage')),
  order: 8,
}
