/** {@link SelectField} 컴포넌트 props. */
interface SelectFieldProps {
  /** 선택 요소 id (FormField의 htmlFor와 연결). */
  id?: string
  /** 현재 선택 값. 미선택 시 빈 문자열. */
  value: string
  /** 값 변경 콜백 (문자열 값 전달). */
  onChange: (value: string) => void
  /** 선택 옵션 목록 (constants의 `as const` 배열을 그대로 사용). */
  options: readonly string[]
  /** 미선택 상태 안내 문구. */
  placeholder?: string
}

/**
 * 드롭다운 선택 필드.
 * options로 `constants`의 상수 배열을 그대로 넘기면 되도록 설계해
 * 옵션 정의를 한 곳(constants)에서만 관리합니다.
 *
 * @param props - {@link SelectFieldProps}
 * @returns 선택 엘리먼트
 */
export default function SelectField({
  id,
  value,
  onChange,
  options,
  placeholder = '선택',
}: SelectFieldProps) {
  return (
    <select
      id={id}
      className="form-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
