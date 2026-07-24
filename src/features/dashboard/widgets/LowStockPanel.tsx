import { Card, Badge } from '@/components/ui'
import { isLowStock } from '@/lib/format'
import { LOW_STOCK_ITEMS } from '../mock/dashboardMock'

/**
 * 소모품 재고 부족 현황 표. (이미지 ④ '소모품 재고 현황')
 * 현재고가 적정재고 미만인 항목을 '부족'으로 표시합니다.
 *
 * @returns 소모품 재고 부족 카드
 */
export default function LowStockPanel() {
  return (
    <Card title="소모품 재고 현황 (부족 항목)">
      <table className="dash-table">
        <thead>
          <tr>
            <th>소모품명</th>
            <th className="num">현재고</th>
            <th className="num">적정재고</th>
            <th className="center">상태</th>
          </tr>
        </thead>
        <tbody>
          {LOW_STOCK_ITEMS.map((item) => {
            const low = isLowStock(item.currentStock, item.threshold)
            return (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td className="num danger-text">
                  {item.currentStock}
                  {item.unit}
                </td>
                <td className="num">
                  {item.threshold}
                  {item.unit}
                </td>
                <td className="center">
                  <Badge variant={low ? 'danger' : 'success'}>{low ? '부족' : '충분'}</Badge>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  )
}
