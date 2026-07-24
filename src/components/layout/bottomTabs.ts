import {
  LayoutDashboard,
  List,
  ScanLine,
  ClipboardList,
  MoreHorizontal,
  Home,
  Wrench,
  Monitor,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'

/** 하단 탭 하나의 정의. */
export interface BottomTab {
  /** 탭 라벨. */
  label: string
  /** 이동 경로. */
  to: string
  /** 탭 아이콘. */
  Icon: LucideIcon
  /** 가운데 강조(원형 부양) 탭 여부. */
  primary?: boolean
}

/** 직원용 자산 앱 하단 탭. (이미지 ②) */
export const ASSET_TABS: BottomTab[] = [
  { label: '대시보드', to: '/asset/home', Icon: LayoutDashboard },
  { label: '자산 목록', to: '/asset/list', Icon: List },
  { label: 'QR 스캔', to: '/asset/register', Icon: ScanLine, primary: true },
  { label: '요청 관리', to: '/asset/requests', Icon: ClipboardList },
  { label: '더보기', to: '/asset/more', Icon: MoreHorizontal },
]

/** IT Support 포털 하단 탭. (이미지 ③) */
export const SUPPORT_TABS: BottomTab[] = [
  { label: '홈', to: '/support/home', Icon: Home },
  { label: '수리 요청', to: '/support/repair', Icon: Wrench, primary: true },
  { label: '요청 내역', to: '/support/history', Icon: ClipboardList },
  { label: '자산 정보', to: '/support/asset-info', Icon: Monitor },
  { label: 'FAQ', to: '/support/faq', Icon: HelpCircle },
]
