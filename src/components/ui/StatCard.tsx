import type { ReactNode } from 'react'
import './StatCard.css'

/** 통계 카드의 강조 색상 테마. 아이콘 배경/색상에 적용됩니다. */
export type StatTone = 'blue' | 'green' | 'orange' | 'red' | 'purple'

/** {@link StatCard} 컴포넌트 props. */
interface StatCardProps {
  /** 지표 이름 (예: '전체 자산 수'). */
  label: string
  /** 큰 숫자로 강조할 값 (이미 포맷된 문자열 권장, 예: '1,248'). */
  value: ReactNode
  /** 값 뒤에 붙는 단위 (예: '대', '개'). */
  unit?: string
  /** 좌측 아이콘 노드. 생략 가능. */
  icon?: ReactNode
  /** 아이콘 강조 색상 테마. 기본값 'blue'. */
  tone?: StatTone
  /** 값 아래 보조 설명 (예: '지난달 대비 +5.2%'). */
  caption?: ReactNode
}

/**
 * 대시보드 상단의 KPI(핵심 지표) 타일.
 * 아이콘 + 라벨 + 큰 값 + 보조 설명으로 구성됩니다. (이미지 ④ 상단 카드)
 *
 * @param props - {@link StatCardProps}
 * @returns 통계 카드 엘리먼트
 */
export default function StatCard({
  label,
  value,
  unit,
  icon,
  tone = 'blue',
  caption,
}: StatCardProps) {
  return (
    <div className="stat-card">
      {icon && <div className={`stat-icon stat-icon-${tone}`}>{icon}</div>}
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <p className="stat-value">
          {value}
          {unit && <span className="stat-unit">{unit}</span>}
        </p>
        {caption && <p className="stat-caption">{caption}</p>}
      </div>
    </div>
  )
}
