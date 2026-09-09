import './RepairPhotos.css'

/** {@link RepairPhotos} 컴포넌트 props. */
interface RepairPhotosProps {
  /** 시트에 저장된 첨부값(쉼표 구분). URL이면 이미지, 아니면 파일명으로 표시. */
  attachments?: string
}

/**
 * 수리 첨부 사진 표시. Google Drive 업로드 URL이면 실제 이미지를,
 * 과거 데이터(파일명만 있는 행)면 파일명을 보여줍니다. (하위호환)
 *
 * @param props - {@link RepairPhotosProps}
 * @returns 첨부 사진 영역
 */
export default function RepairPhotos({ attachments }: RepairPhotosProps) {
  const items = (attachments || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (items.length === 0) {
    return <p className="rp-empty">첨부된 사진이 없습니다.</p>
  }

  return (
    <div className="rp-grid">
      {items.map((item, i) =>
        /^https?:\/\//.test(item) ? (
          // 새 탭에서 원본 보기(클릭). 썸네일 URL이라 목록에서는 축소 표시.
          <a key={i} href={item} target="_blank" rel="noreferrer" className="rp-item">
            <img src={item} alt={`수리 사진 ${i + 1}`} loading="lazy" />
          </a>
        ) : (
          <span key={i} className="rp-name">
            🖼️ {item}
          </span>
        ),
      )}
    </div>
  )
}
