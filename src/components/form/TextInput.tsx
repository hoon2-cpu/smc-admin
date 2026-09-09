import { X } from 'lucide-react'

/** 지원하는 입력 타입. */
type InputType = 'text' | 'date' | 'number'

/** {@link TextInput} 컴포넌트 props. */
interface TextInputProps {
  /** 입력 요소 id (FormField의 htmlFor와 연결). */
  id?: string
  /** 현재 값. */
  value: string
  /** 값 변경 콜백. 이벤트가 아니라 문자열 값을 바로 전달합니다. */
  onChange: (value: string) => void
  /** 자리표시 텍스트. */
  placeholder?: string
  /** 입력 타입. 기본 'text'. */
  type?: InputType
  /** 우측 지우기(X) 버튼 표시 여부. */
  clearable?: boolean
  /** 자동완성 제안 목록(datalist). 자유 입력은 그대로 허용. */
  options?: readonly string[]
}

/**
 * 기본 텍스트 입력. onChange가 문자열을 바로 넘겨줘
 * 상위에서 `e.target.value`를 매번 꺼낼 필요가 없습니다.
 *
 * @param props - {@link TextInputProps}
 * @returns 입력 엘리먼트
 */
export default function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  clearable = false,
  options,
}: TextInputProps) {
  // datalist는 고유 id가 필요 — 입력 id 기반으로 생성(id 없으면 datalist 생략)
  const listId = options && id ? `${id}-list` : undefined
  return (
    <div className="input-wrap">
      <input
        id={id}
        className="form-input"
        type={type}
        value={value}
        placeholder={placeholder}
        list={listId}
        onChange={(event) => onChange(event.target.value)}
      />
      {listId && (
        <datalist id={listId}>
          {options!.map((opt) => (
            <option key={opt} value={opt} />
          ))}
        </datalist>
      )}
      {/* 값이 있을 때만 지우기 버튼 노출 */}
      {clearable && value && (
        <button
          type="button"
          className="input-clear"
          aria-label="지우기"
          onClick={() => onChange('')}
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
