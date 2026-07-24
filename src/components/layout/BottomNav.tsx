import { NavLink } from 'react-router-dom'
import type { BottomTab } from './bottomTabs'
import './BottomNav.css'

/** {@link BottomNav} 컴포넌트 props. */
interface BottomNavProps {
  /** 렌더링할 탭 목록. (자산 앱/서포트 포털이 서로 다른 목록을 전달) */
  tabs: BottomTab[]
}

/**
 * 하단 고정 탭 바 (표현용 공용 컴포넌트).
 * 탭 목록을 props로 받아, 자산 앱과 IT Support 포털에서 재사용합니다.
 * 현재 경로에 해당하는 탭은 NavLink가 자동으로 활성화합니다.
 *
 * @param props - {@link BottomNavProps}
 * @returns 하단 탭 바 엘리먼트
 */
export default function BottomNav({ tabs }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {tabs.map(({ label, to, Icon, primary }) => (
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
