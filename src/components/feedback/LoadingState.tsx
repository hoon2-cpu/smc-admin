import { Loader2 } from 'lucide-react'
import './feedback.css'

/** {@link LoadingState} 컴포넌트 props. */
interface LoadingStateProps {
  /** 표시할 문구. 기본 '불러오는 중…'. */
  message?: string
}

/**
 * 공통 로딩 표시(회전 스피너 + 문구). 목록 조회 중 일관된 UI로 사용합니다.
 *
 * @param props - {@link LoadingStateProps}
 * @returns 로딩 표시 엘리먼트
 */
export default function LoadingState({ message = '불러오는 중…' }: LoadingStateProps) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <Loader2 className="loading-spin" size={18} />
      <span>{message}</span>
    </div>
  )
}
