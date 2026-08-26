import { useMemo, useState } from 'react'
import { Laptop, BadgeCheck, Wrench, Trash2, Plus, Search, ArrowUpDown, ScanLine } from 'lucide-react'
import { StatCard, Badge, Modal, Card, QrScannerModal } from '@/components/ui'
import { getAssetStatusVariant } from '@/lib/badgeVariant'
import { useAssets } from './useAssets'
import AssetRegisterForm from './AssetRegisterForm'
import AssetDetailModal from './AssetDetailModal'
import type { AssetRow } from './types'
import './AssetListPage.css'

/** 취득 구분 필터 탭. */
const FILTERS = ['전체', '구매', '렌탈'] as const
type AssetFilter = (typeof FILTERS)[number]

/** 정렬 가능한 컬럼 키. */
type SortKey = 'assetNumber' | 'name' | 'category' | 'manufacturer' | 'user' | 'location' | 'acquiredDate' | 'status'

/**
 * 자산관리 모듈 메인 페이지. (관리자 데스크톱)
 * 요약 카드 + 취득구분 필터 + 검색 + 정렬 가능한 목록 표를 제공하고,
 * '자산 등록'은 모달로 처리합니다.
 *
 * @returns 자산관리 페이지
 */
export default function AssetListPage() {
  const { assets, summary, loading, usingMock, patchAsset } = useAssets()
  const [registerOpen, setRegisterOpen] = useState(false)
  const [scanOpen, setScanOpen] = useState(false)
  const [selected, setSelected] = useState<AssetRow | null>(null)
  const [filter, setFilter] = useState<AssetFilter>('전체')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey | ''>('')
  const [sortAsc, setSortAsc] = useState(true)

  // 취득구분 필터 → 검색어 필터 → 정렬 순으로 목록을 가공합니다.
  const visibleAssets = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    let list = filter === '전체' ? assets : assets.filter((a) => a.acquisitionType === filter)

    if (keyword) {
      list = list.filter((a) =>
        [a.assetNumber, a.name, a.user, a.managementNumber, a.rentalCompany, a.manufacturer]
          .join(' ')
          .toLowerCase()
          .includes(keyword),
      )
    }

    if (sortKey) {
      // 문자열 기준 정렬(취득일은 YYYY-MM-DD라 사전순=날짜순)
      list = [...list].sort((a, b) => {
        const cmp = String(a[sortKey]).localeCompare(String(b[sortKey]), 'ko')
        return sortAsc ? cmp : -cmp
      })
    }
    return list
  }, [assets, filter, query, sortKey, sortAsc])

  /**
   * QR 스캔 결과 처리. 디코드된 자산번호로 목록에서 자산을 찾아 상세를 엽니다.
   * @param text - 스캔된 문자열(자산번호)
   */
  function handleScanned(text: string) {
    setScanOpen(false)
    const code = text.trim()
    const found = assets.find((a) => a.assetNumber === code)
    if (found) {
      setSelected(found)
    } else {
      window.alert(`해당 자산을 찾을 수 없습니다: ${code}`)
    }
  }

  /**
   * 정렬 헤더 클릭 처리. 같은 열이면 방향 토글, 다른 열이면 오름차순으로 시작.
   * @param key - 정렬할 컬럼 키
   */
  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((prev) => !prev)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  /** 정렬 가능한 th를 렌더링합니다. */
  function sortableHeader(key: SortKey, label: string, center = false) {
    const active = sortKey === key
    return (
      <th
        className={`sortable${center ? ' center' : ''}${active ? ' active' : ''}`}
        onClick={() => handleSort(key)}
      >
        {label}
        <ArrowUpDown size={12} className="sort-icon" />
        {active && <span className="sort-dir">{sortAsc ? '▲' : '▼'}</span>}
      </th>
    )
  }

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
          <div className="asset-actions">
            <button type="button" className="asset-scan-btn" onClick={() => setScanOpen(true)}>
              <ScanLine size={16} /> 스캔
            </button>
            <button type="button" className="asset-add-btn" onClick={() => setRegisterOpen(true)}>
              <Plus size={16} /> 자산 등록
            </button>
          </div>
        }
      >
        <div className="asset-toolbar">
          <div className="asset-filter-tabs">
            {FILTERS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={tab === filter ? 'asset-filter-tab active' : 'asset-filter-tab'}
                onClick={() => setFilter(tab)}
              >
                {tab}
                {tab !== '전체' && (
                  <span className="asset-filter-count">
                    {assets.filter((a) => a.acquisitionType === tab).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="asset-search">
            <Search size={15} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="자산명·번호·사용자·관리번호 검색"
            />
          </div>
        </div>

        <div className="asset-table-scroll">
          <table className="asset-table">
            <thead>
              <tr>
                {sortableHeader('assetNumber', '자산번호')}
                {sortableHeader('name', '자산명')}
                {sortableHeader('category', '구분')}
                <th>취득</th>
                {sortableHeader('manufacturer', '제조사')}
                {sortableHeader('user', '사용자')}
                {sortableHeader('location', '위치')}
                {sortableHeader('acquiredDate', '취득일')}
                {sortableHeader('status', '상태', true)}
              </tr>
            </thead>
            <tbody>
              {visibleAssets.length === 0 && (
                <tr>
                  <td colSpan={9} className="asset-empty">
                    {query || filter !== '전체'
                      ? '조건에 맞는 자산이 없습니다.'
                      : '등록된 자산이 없습니다. 우측 상단 ‘자산 등록’으로 추가하세요.'}
                  </td>
                </tr>
              )}
              {visibleAssets.map((asset: AssetRow) => (
                <tr
                  key={asset.assetNumber || asset.name}
                  className="asset-row"
                  onClick={() => setSelected(asset)}
                >
                  <td>{asset.assetNumber}</td>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>
                    {asset.acquisitionType === '렌탈' ? `렌탈 (${asset.rentalCompany})` : '구매'}
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

      {scanOpen && <QrScannerModal onClose={() => setScanOpen(false)} onDetected={handleScanned} />}

      {/* 선택 시에만 마운트 + key로 자산별 초기값을 새로 반영 */}
      {selected && (
        <AssetDetailModal
          key={selected.assetNumber}
          asset={selected}
          onClose={() => setSelected(null)}
          onSaved={(assetNumber, patch) => patchAsset(assetNumber, patch)}
        />
      )}
    </>
  )
}
