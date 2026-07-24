import { Outlet } from 'react-router-dom'
import SupportHeader from './SupportHeader'
import BottomNav from './BottomNav'
import { SUPPORT_TABS } from './bottomTabs'
import './SupportLayout.css'

/**
 * IT Support 포털 레이아웃. (이미지 ③)
 * 상단 헤더 + 중앙 정렬 콘텐츠 + 하단 탭 바로 구성됩니다.
 *
 * @returns 서포트 레이아웃 엘리먼트
 */
export default function SupportLayout() {
  return (
    <div className="support-app">
      <SupportHeader />
      <div className="support-content">
        <Outlet />
      </div>
      <BottomNav tabs={SUPPORT_TABS} />
    </div>
  )
}
