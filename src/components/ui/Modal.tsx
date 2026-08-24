import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import './Modal.css'

/** {@link Modal} 컴포넌트 props. */
interface ModalProps {
  /** 열림 여부. false면 아무것도 렌더링하지 않음. */
  open: boolean
  /** 상단 제목. */
  title: string
  /** 닫기 요청 콜백 (오버레이 클릭 · X · ESC). */
  onClose: () => void
  /** 본문 내용. */
  children: ReactNode
  /** 하단 액션 영역(선택). */
  footer?: ReactNode
}

/**
 * 재사용 모달 다이얼로그.
 * 오버레이 클릭 / X 버튼 / ESC 키로 닫히며, 본문은 내부 스크롤됩니다.
 *
 * @param props - {@link ModalProps}
 * @returns 모달 엘리먼트 (닫힘 상태면 null)
 */
export default function Modal({ open, title, onClose, children, footer }: ModalProps) {
  // ESC 키로 닫기. open일 때만 리스너를 등록해 불필요한 바인딩을 피합니다.
  useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* 내용 클릭이 오버레이로 전파되어 닫히지 않도록 stopPropagation */}
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <h2 className="modal-title">{title}</h2>
          <button type="button" className="modal-close" aria-label="닫기" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-foot">{footer}</footer>}
      </div>
    </div>
  )
}
