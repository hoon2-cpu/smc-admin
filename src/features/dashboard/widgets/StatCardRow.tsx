import { Laptop, BadgeCheck, Wrench, Trash2, Package } from 'lucide-react'
import { StatCard, type StatTone } from '@/components/ui'

/** 통계 카드 한 장의 표시 데이터. */
interface StatDef {
  label: string
  value: string
  unit: string
  caption: string
  tone: StatTone
  Icon: typeof Laptop
}

/**
 * 상단 KPI 카드 정의. (이미지 ④ 상단 5개 카드)
 * 아이콘이 React 컴포넌트라 목 데이터가 아닌 위젯 내부에 둡니다.
 */
const STATS: StatDef[] = [
  { label: '전체 자산 수', value: '1,248', unit: '대', caption: '지난달 대비 +5.2%', tone: 'blue', Icon: Laptop },
  { label: '사용 중 자산', value: '1,002', unit: '대', caption: '전체의 80.4%', tone: 'green', Icon: BadgeCheck },
  { label: '수리 중 자산', value: '28', unit: '대', caption: '전체의 2.2%', tone: 'orange', Icon: Wrench },
  { label: '폐기 예정 자산', value: '45', unit: '대', caption: '30일 이내', tone: 'red', Icon: Trash2 },
  { label: '소모품 재고 부족', value: '16', unit: '개', caption: '즉시 확인 필요', tone: 'purple', Icon: Package },
]

/**
 * 대시보드 상단 통계 카드 묶음.
 * @returns 통계 카드 5개를 담은 그리드
 */
export default function StatCardRow() {
  return (
    <div className="stat-row">
      {STATS.map(({ Icon, ...stat }) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          caption={stat.caption}
          tone={stat.tone}
          icon={<Icon size={22} />}
        />
      ))}
    </div>
  )
}
