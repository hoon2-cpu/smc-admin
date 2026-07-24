import { ShieldCheck, Bell, ChevronDown } from 'lucide-react'
import './SupportHeader.css'

/**
 * IT Support 포털 상단 헤더. (이미지 ③ 상단)
 * 로고 + 알림 + 로그인 사용자 정보를 표시합니다.
 *
 * @returns 서포트 헤더 엘리먼트
 */
export default function SupportHeader() {
  return (
    <header className="support-header">
      <div className="support-logo">
        <ShieldCheck size={22} />
        <span>IT Support</span>
      </div>

      <div className="support-header-right">
        <button type="button" className="support-bell" aria-label="알림">
          <Bell size={20} />
        </button>
        <div className="support-user">
          <span className="support-avatar" />
          <span className="support-user-text">
            <strong>홍길동</strong>
            <small>경영지원실</small>
          </span>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  )
}
