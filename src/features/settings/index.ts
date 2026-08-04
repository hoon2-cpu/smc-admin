import { lazy } from 'react'
import { Settings } from 'lucide-react'
import type { ModuleDef } from '@/app/types'

/** 설정 모듈 정의. */
export const settingsModule: ModuleDef = {
  id: 'settings',
  title: '설정',
  path: 'settings',
  icon: Settings,
  element: lazy(() => import('./SettingsPage')),
  order: 8,
}
