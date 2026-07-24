import type { ReactNode } from 'react'
import './Card.css'

/** {@link Card} 컴포넌트 props. */
interface CardProps {
  /** 카드 상단 제목. 생략 시 헤더 영역 자체를 렌더링하지 않습니다. */
  title?: string
  /** 제목 우측에 표시할 보조 액션 (예: '더보기' 링크). */
  action?: ReactNode
  /** 카드 본문 내용. */
  children: ReactNode
  /** 외부에서 레이아웃을 조정하기 위한 추가 className. */
  className?: string
}

/**
 * 흰 배경 + 라운드 + 그림자를 가진 기본 패널 컨테이너.
 * 대시보드의 모든 위젯(차트/표/목록)을 감싸는 공통 틀입니다.
 *
 * @param props - {@link CardProps}
 * @returns 카드 엘리먼트
 */
export default function Card({ title, action, children, className }: CardProps) {
  // title/action이 하나라도 있을 때만 헤더를 그려 불필요한 여백을 방지합니다.
  const hasHeader = Boolean(title || action)

  return (
    <section className={className ? `card ${className}` : 'card'}>
      {hasHeader && (
        <header className="card-head">
          {title && <h3 className="card-title">{title}</h3>}
          {action && <div className="card-action">{action}</div>}
        </header>
      )}
      <div className="card-body">{children}</div>
    </section>
  )
}
