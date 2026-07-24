import { NavLink } from 'react-router-dom'
import { LayoutDashboard, List, ScanLine, ClipboardList, MoreHorizontal } from 'lucide-react'
import './BottomNav.css'

/** 하단 탭 하나의 정의. */
interface TabDef {
  label: string
  to: string
  Icon: typeof List
  /** 가운데 강조(QR 스캔) 탭 여부. */
  primary?: boolean
}

/** 직원용 앱 하단 탭 목록. (이미지 ② 하단 네비게이션) */
const TABS: TabDef[] = [
  { label: '대시보드', to: '/asset/home', Icon: LayoutDashboard },
  { label: '자산 목록', to: '/asset/list', Icon: List },
  { label: 'QR 스캔', to: '/asset/register', Icon: ScanLine, primary: true },
  { label: '요청 관리', to: '/asset/requests', Icon: ClipboardList },
  { label: '더보기', to: '/asset/more', Icon: MoreHorizontal },
]

/**
 * 직원용 모바일 앱 하단 고정 탭 바.
 * 현재 경로에 해당하는 탭이 자동으로 활성화됩니다(NavLink).
 *
 * @returns 하단 탭 바 엘리먼트
 */
export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ label, to, Icon, primary }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => {
            const classes = ['bottom-tab']
            if (primary) classes.push('primary')
            if (isActive) classes.push('active')
            return classes.join(' ')
          }}
        >
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
