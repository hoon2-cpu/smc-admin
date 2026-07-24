import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import { ASSET_TABS } from './bottomTabs'
import './EmployeeLayout.css'

/**
 * 직원용 모바일 앱 레이아웃.
 * 최대 480px 폭의 세로 화면 + 하단 고정 탭 바를 제공하며,
 * 각 페이지는 <Outlet /> 자리에 렌더링됩니다.
 * (페이지별 헤더는 각 페이지가 MobileHeader로 직접 렌더링)
 *
 * @returns 직원용 레이아웃 엘리먼트
 */
export default function EmployeeLayout() {
  return (
    <div className="employee-app">
      <div className="employee-content">
        <Outlet />
      </div>
      <BottomNav tabs={ASSET_TABS} />
    </div>
  )
}
