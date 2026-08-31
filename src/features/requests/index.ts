import { lazy } from 'react'
import { Inbox } from 'lucide-react'
import type { ModuleDef } from '@/app/types'

/** 신청관리(총무팀) 모듈 정의. 직원 신청(자산/반납/소모품) 접수·처리. */
export const requestsModule: ModuleDef = {
  id: 'requests',
  title: '신청관리',
  path: 'requests',
  icon: Inbox,
  element: lazy(() => import('./RequestManagePage')),
  order: 6,
}
