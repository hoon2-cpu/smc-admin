import { Trash2 } from 'lucide-react'
import { Card, Badge, type BadgeVariant } from '@/components/ui'
import EmptyState from '@/components/feedback/EmptyState'
import type { DisposalItem } from '../types'

/** {@link DisposalScheduleTable} 컴포넌트 props. */
interface DisposalScheduleTableProps {
  /** 폐기 예정 자산 목록. */
  items: DisposalItem[]
}

/**
 * 폐기까지 남은 일수에 따라 뱃지 색상을 결정합니다. (임박할수록 위험색)
 * @param withinDays - 폐기 예정 기준 일수
 * @returns 뱃지 색상 변형
 */
function getDDayVariant(withinDays: number): BadgeVariant {
  if (withinDays <= 30) return 'danger'
  if (withinDays <= 60) return 'warning'
  return 'neutral'
}

/**
 * 자산 폐기 예정 표. (이미지 ④ '자산 폐기 예정')
 * 실데이터에 내용연수/D-day가 없으면 '폐기예정' 뱃지로 표시합니다.
 *
 * @param props - {@link DisposalScheduleTableProps}
 * @returns 폐기 예정 자산 카드
 */
export default function DisposalScheduleTable({ items }: DisposalScheduleTableProps) {
  return (
    <Card title="자산 폐기 예정">
      {items.length === 0 ? (
        <EmptyState icon={Trash2} title="폐기 예정 자산이 없습니다." />
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>자산번호</th>
              <th>자산명</th>
              <th>취득일</th>
              <th className="center">내용연수</th>
              <th>폐기예정일</th>
              <th className="center">상태</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.assetNumber}>
                <td>{item.assetNumber}</td>
                <td>{item.name}</td>
                <td>{item.acquiredDate || '-'}</td>
                <td className="center">{item.usefulLifeYears != null ? `${item.usefulLifeYears}년` : '-'}</td>
                <td>{item.disposalDate || '-'}</td>
                <td className="center">
                  {item.withinDays != null ? (
                    <Badge variant={getDDayVariant(item.withinDays)}>{item.withinDays}일 이내</Badge>
                  ) : (
                    <Badge variant="warning">폐기예정</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  )
}
