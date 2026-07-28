import { Card, Badge } from '@/components/ui'
import { getAssetStatusVariant } from '@/lib/badgeVariant'
import type { RecentAssetItem } from '../types'

/** {@link RecentAssetsTable} 컴포넌트 props. */
interface RecentAssetsTableProps {
  /** 최근 등록 자산 목록. */
  assets: RecentAssetItem[]
}

/**
 * 최근 등록 자산 표. (이미지 ④ '최근 등록 자산')
 *
 * @returns 최근 등록 자산 카드
 */
export default function RecentAssetsTable({ assets }: RecentAssetsTableProps) {
  return (
    <Card title="최근 등록 자산">
      <table className="dash-table">
        <thead>
          <tr>
            <th>자산번호</th>
            <th>자산명</th>
            <th>자산구분</th>
            <th>취득일</th>
            <th>사용자</th>
            <th className="center">상태</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.assetNumber}>
              <td>{asset.assetNumber}</td>
              <td>{asset.name}</td>
              <td>{asset.category}</td>
              <td>{asset.acquiredDate}</td>
              <td>{asset.user}</td>
              <td className="center">
                <Badge variant={getAssetStatusVariant(asset.status)}>{asset.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
