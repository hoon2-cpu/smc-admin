import { Modal, Badge } from '@/components/ui'
import { getRepairStatusVariant } from '@/lib/badgeVariant'
import type { RepairRow } from '@/features/repair/types'
import './VendorDetailModal.css'

/** {@link VendorDetailModal} 컴포넌트 props. */
interface VendorDetailModalProps {
  /** 표시할 수리 건. null이면 렌더 안 함. */
  repair: RepairRow | null
  /** 닫기 콜백. */
  onClose: () => void
}

/**
 * 외부업체용 수리 상세 팝업.
 * 목록에서 요청을 클릭하면 해당 건의 전체 정보(증상·사진 등)를 보여줍니다.
 *
 * @param props - {@link VendorDetailModalProps}
 * @returns 상세 팝업 (repair가 null이면 렌더 안 함)
 */
export default function VendorDetailModal({ repair, onClose }: VendorDetailModalProps) {
  if (!repair) return null

  const photos = repair.attachments
    ? repair.attachments.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <Modal open title={`${repair.ticketNumber} · 수리 상세`} onClose={onClose}>
      <dl className="vd-grid">
        <div>
          <dt>접수일</dt>
          <dd>{repair.receivedAt}</dd>
        </div>
        <div>
          <dt>상태</dt>
          <dd>
            <Badge variant={getRepairStatusVariant(repair.status)}>{repair.status}</Badge>
          </dd>
        </div>
        <div>
          <dt>자산</dt>
          <dd>
            {repair.assetNumber} {repair.assetName && `· ${repair.assetName}`}
          </dd>
        </div>
        <div>
          <dt>우선순위</dt>
          <dd>{repair.priority}</dd>
        </div>
        <div className="vd-full">
          <dt>증상</dt>
          <dd>{repair.symptom}</dd>
        </div>
      </dl>

      <div className="vd-photos">
        <div className="vd-photos-title">첨부 사진 ({photos.length})</div>
        {photos.length === 0 ? (
          <p className="vd-photos-empty">첨부된 사진이 없습니다.</p>
        ) : (
          <>
            <ul className="vd-photo-list">
              {photos.map((name) => (
                <li key={name}>🖼️ {name}</li>
              ))}
            </ul>
            <p className="vd-photos-note">
              ※ 이미지 미리보기는 준비 중입니다(현재는 파일명 표시). 원본 전달이 필요하면 총무팀에 요청하세요.
            </p>
          </>
        )}
      </div>
    </Modal>
  )
}
