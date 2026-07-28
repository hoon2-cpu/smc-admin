import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui'
import type { CategoryDatum } from '../types'
import './AssetCategoryChart.css'

/** 자산 구분별 도넛 색상 (노트북/모니터/데스크탑/프린터/기타 순). */
const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#7c3aed', '#94a3b8']

/** {@link AssetCategoryChart} 컴포넌트 props. */
interface AssetCategoryChartProps {
  /** 자산 구분별 집계. */
  categories: CategoryDatum[]
}

/**
 * 자산 구분별 비율을 보여주는 도넛 차트. (이미지 ④ '자산 현황')
 * 가운데에 총 자산 수를, 우측에 항목별 개수/비율을 표시합니다.
 *
 * @param props - {@link AssetCategoryChartProps}
 * @returns 자산 현황 차트 카드
 */
export default function AssetCategoryChart({ categories }: AssetCategoryChartProps) {
  // 비율 계산을 위해 합계를 미리 구합니다.
  const total = categories.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card title="자산 현황">
      <div className="category-chart">
        <div className="category-donut">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="count"
                nameKey="category"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                stroke="none"
              >
                {categories.map((entry, index) => (
                  <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="category-center">
            <strong>{total.toLocaleString('ko-KR')}</strong>
            <span>총 자산</span>
          </div>
        </div>

        <ul className="category-legend">
          {categories.map((item, index) => {
            const percent = ((item.count / total) * 100).toFixed(1)
            return (
              <li key={item.category}>
                <span className="legend-dot" style={{ background: COLORS[index % COLORS.length] }} />
                <span className="legend-name">{item.category}</span>
                <span className="legend-value">
                  {item.count.toLocaleString('ko-KR')} ({percent}%)
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </Card>
  )
}
