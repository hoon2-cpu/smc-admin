import { Card, Badge, type BadgeVariant } from '@/components/ui'
import { DISPOSAL_ITEMS } from '../mock/dashboardMock'

/**
 * 폐기까지 남은 일수에 따라 뱃지 색상을 결정합니다.
 * 임박할수록(작을수록) 위험한 색으로 강조합니다.
 *
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
 *
 * @returns 폐기 예정 자산 카드
 */
export default function DisposalScheduleTable() {
  return (
    <Card title="자산 폐기 예정">
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
          {DISPOSAL_ITEMS.map((item) => (
            <tr key={item.assetNumber}>
              <td>{item.assetNumber}</td>
              <td>{item.name}</td>
              <td>{item.acquiredDate}</td>
              <td className="center">{item.usefulLifeYears}년</td>
              <td>{item.disposalDate}</td>
              <td className="center">
                <Badge variant={getDDayVariant(item.withinDays)}>{item.withinDays}일 이내</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
