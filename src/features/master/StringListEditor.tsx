import { Plus, Trash2 } from 'lucide-react'
import './StringListEditor.css'

/** {@link StringListEditor} 컴포넌트 props. */
interface StringListEditorProps {
  /** 편집할 문자열 목록. */
  items: string[]
  /** 목록 변경 콜백. */
  onChange: (items: string[]) => void
  /** 입력 자리표시. */
  placeholder?: string
}

/**
 * 문자열 목록 편집기. 항목 추가/수정/삭제를 제공합니다. (코드 Master 각 리스트에 재사용)
 *
 * @param props - {@link StringListEditorProps}
 * @returns 리스트 편집 UI
 */
export default function StringListEditor({ items, onChange, placeholder }: StringListEditorProps) {
  /** 특정 항목 값 변경. */
  function setAt(i: number, value: string) {
    onChange(items.map((it, idx) => (idx === i ? value : it)))
  }
  /** 항목 삭제. */
  function removeAt(i: number) {
    onChange(items.filter((_, idx) => idx !== i))
  }

  return (
    <div className="sle">
      <div className="sle-list">
        {items.map((item, i) => (
          <div key={i} className="sle-row">
            <input value={item} onChange={(e) => setAt(i, e.target.value)} placeholder={placeholder} />
            <button type="button" className="sle-del" onClick={() => removeAt(i)} aria-label="삭제">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="sle-add" onClick={() => onChange([...items, ''])}>
        <Plus size={14} /> 항목 추가
      </button>
    </div>
  )
}
