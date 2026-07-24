import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import './MobileHeader.css'

/** {@link MobileHeader} 컴포넌트 props. */
interface MobileHeaderProps {
  /** 화면 제목. */
  title: string
  /** 제목 아래 보조 설명. */
  subtitle?: string
  /** 우측 상단 액션(예: 히스토리 아이콘). */
  rightAction?: ReactNode
}

/**
 * 직원용 모바일 화면 상단 헤더.
 * 뒤로가기 + 제목/부제 + (선택)우측 액션으로 구성됩니다.
 *
 * @param props - {@link MobileHeaderProps}
 * @returns 헤더 엘리먼트
 */
export default function MobileHeader({ title, subtitle, rightAction }: MobileHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="mobile-header">
      <button
        type="button"
        className="mobile-back"
        aria-label="뒤로가기"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={22} />
      </button>

      <div className="mobile-header-text">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="mobile-header-action">{rightAction}</div>
    </header>
  )
}
