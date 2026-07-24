import type { ReactNode } from 'react'
import './Badge.css'

/**
 * 뱃지 색상 변형. 도메인 상태값이 아니라 '의미' 단위로 정의해
 * 어느 화면에서든 재사용할 수 있게 했습니다.
 * (예: 완료→success, 수리중→warning, 폐기/부족→danger)
 */
export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

/** {@link Badge} 컴포넌트 props. */
interface BadgeProps {
  /** 색상 변형. 기본값 'neutral'. */
  variant?: BadgeVariant
  /** 뱃지에 표시할 텍스트/노드. */
  children: ReactNode
}

/**
 * 상태를 색상으로 표현하는 작은 알약(pill) 라벨.
 *
 * @param props - {@link BadgeProps}
 * @returns 뱃지 엘리먼트
 */
export default function Badge({ variant = 'neutral', children }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{children}</span>
}
