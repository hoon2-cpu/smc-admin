import { Printer, Trash2, X } from 'lucide-react'
import './AssetBulkBar.css'

/** {@link AssetBulkBar} 컴포넌트 props. */
interface AssetBulkBarProps {
  /** 선택 건수. 0이면 렌더 안 함. */
  count: number
  /** 라벨 일괄 인쇄. */
  onPrint: () => void
  /** 선택 대량 폐기. */
  onDispose: () => void
  /** 선택 해제. */
  onClear: () => void
  /** 처리 진행 중(버튼 비활성화). */
  busy?: boolean
}

/**
 * 자산 목록 하단에 뜨는 대량 작업 바.
 * 선택된 자산이 있을 때만 나타나 라벨 일괄 인쇄·대량 폐기를 제공합니다.
 *
 * @param props - {@link AssetBulkBarProps}
 * @returns 대량 작업 바 (선택 0건이면 null)
 */
export default function AssetBulkBar({ count, onPrint, onDispose, onClear, busy }: AssetBulkBarProps) {
  if (count === 0) return null
  return (
    <div className="bulk-bar" role="toolbar" aria-label="선택 자산 일괄 작업">
      <span className="bulk-count">{count}건 선택</span>
      <div className="bulk-actions">
        <button type="button" className="bulk-btn" onClick={onPrint} disabled={busy}>
          <Printer size={16} /> 라벨 일괄 인쇄
        </button>
        <button type="button" className="bulk-btn danger" onClick={onDispose} disabled={busy}>
          <Trash2 size={16} /> {busy ? '처리 중…' : '선택 폐기'}
        </button>
        <button type="button" className="bulk-btn ghost" onClick={onClear} disabled={busy} aria-label="선택 해제">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
