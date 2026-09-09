import { useEffect, useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import './RepairPhotos.css'

/** {@link RepairPhotos} 컴포넌트 props. */
interface RepairPhotosProps {
  /** 시트에 저장된 첨부값(쉼표 구분). URL이면 이미지, 아니면 파일명으로 표시. */
  attachments?: string
}

/**
 * 수리 첨부 사진 표시. Google Drive 업로드 URL이면 실제 이미지를 썸네일로 보여주고,
 * 클릭하면 앱 내 라이트박스로 크게 봅니다. 과거 데이터(파일명만)면 파일명을 표시합니다.
 *
 * @param props - {@link RepairPhotosProps}
 * @returns 첨부 사진 영역
 */
export default function RepairPhotos({ attachments }: RepairPhotosProps) {
  // 라이트박스로 크게 볼 이미지 URL(null이면 닫힘)
  const [zoom, setZoom] = useState<string | null>(null)

  // 라이트박스 열림 동안 ESC로 닫기
  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  const items = (attachments || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (items.length === 0) {
    return <p className="rp-empty">첨부된 사진이 없습니다.</p>
  }

  return (
    <>
      <div className="rp-grid">
        {items.map((item, i) =>
          /^https?:\/\//.test(item) ? (
            <button key={i} type="button" className="rp-item" onClick={() => setZoom(item)}>
              <img src={item} alt={`수리 사진 ${i + 1}`} loading="lazy" />
            </button>
          ) : (
            <span key={i} className="rp-name">
              🖼️ {item}
            </span>
          ),
        )}
      </div>

      {/* 라이트박스: 배경 클릭/X/ESC로 닫기 */}
      {zoom && (
        <div className="rp-lightbox" role="dialog" aria-modal="true" onClick={() => setZoom(null)}>
          <button type="button" className="rp-close" aria-label="닫기" onClick={() => setZoom(null)}>
            <X size={22} />
          </button>
          {/* 이미지 클릭은 닫힘 전파 방지 */}
          <img className="rp-full" src={zoom} alt="수리 사진 크게 보기" onClick={(e) => e.stopPropagation()} />
          <a
            className="rp-original"
            href={zoom}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} /> 새 탭에서 원본 열기
          </a>
        </div>
      )}
    </>
  )
}
