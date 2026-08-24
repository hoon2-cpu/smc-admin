import { useState } from 'react'
import { Laptop, BadgeCheck, Wrench, Trash2, Plus } from 'lucide-react'
import { StatCard, Badge, Modal, Card } from '@/components/ui'
import { getAssetStatusVariant } from '@/lib/badgeVariant'
import { useAssets } from './useAssets'
import AssetRegisterForm from './AssetRegisterForm'
import './AssetListPage.css'

/**
 * 자산관리 모듈 메인 페이지. (관리자 데스크톱)
 * 상단 요약 카드 + 자산 목록 표를 보여주고, '자산 등록'은 모달로 처리합니다.
 *
 * @returns 자산관리 페이지
 */
export default function AssetListPage() {
  const { assets, summary, loading, usingMock } = useAssets()
  const [registerOpen, setRegisterOpen] = useState(false)

  return (
    <>
      {loading && <p className="asset-notice">자산 목록 불러오는 중…</p>}
      {!loading && usingMock && (
        <p className="asset-notice">샘플(mock) 데이터 표시 중 — 구글시트 연동(재배포) 후 실제 자산이 표시됩니다.</p>
      )}

      <div className="asset-stat-row">
        <StatCard label="전체 자산" value={summary.total} unit="대" tone="blue" icon={<Laptop size={22} />} />
        <StatCard label="사용 중" value={summary.inUse} unit="대" tone="green" icon={<BadgeCheck size={22} />} />
        <StatCard label="수리 중" value={summary.repairing} unit="대" tone="orange" icon={<Wrench size={22} />} />
        <StatCard label="폐기 예정" value={summary.disposal} unit="대" tone="red" icon={<Trash2 size={22} />} />
      </div>

      <Card
        title="자산 목록"
        action={
          <button type="button" className="asset-add-btn" onClick={() => setRegisterOpen(true)}>
            <Plus size={16} /> 자산 등록
          </button>
        }
      >
        <div className="asset-table-scroll">
          <table className="asset-table">
            <thead>
              <tr>
                <th>자산번호</th>
                <th>자산명</th>
                <th>구분</th>
                <th>취득</th>
                <th>제조사</th>
                <th>사용자</th>
                <th>위치</th>
                <th>취득일</th>
                <th className="center">상태</th>
              </tr>
            </thead>
            <tbody>
              {assets.length === 0 && (
                <tr>
                  <td colSpan={9} className="asset-empty">
                    등록된 자산이 없습니다. 우측 상단 &lsquo;자산 등록&rsquo;으로 추가하세요.
                  </td>
                </tr>
              )}
              {assets.map((asset) => (
                <tr key={asset.assetNumber}>
                  <td>{asset.assetNumber}</td>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>
                    {asset.acquisitionType === '렌탈'
                      ? `렌탈 (${asset.rentalCompany})`
                      : '구매'}
                  </td>
                  <td>{asset.manufacturer}</td>
                  <td>{asset.user}</td>
                  <td>{asset.location}</td>
                  <td>{asset.acquiredDate}</td>
                  <td className="center">
                    <Badge variant={getAssetStatusVariant(asset.status)}>{asset.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={registerOpen} title="자산 등록" onClose={() => setRegisterOpen(false)}>
        <AssetRegisterForm onSuccess={() => setRegisterOpen(false)} />
      </Modal>
    </>
  )
}
