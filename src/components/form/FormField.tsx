import type { ReactNode } from 'react'

/** {@link FormField} 컴포넌트 props. */
interface FormFieldProps {
  /** 필드 라벨 텍스트. */
  label: string
  /** 연결할 입력 요소의 id (라벨 클릭 시 포커스 이동). */
  htmlFor?: string
  /** 필수 입력 여부. true면 라벨에 * 표시. */
  required?: boolean
  /** 한 줄 전체(2열 span)를 차지할지 여부. */
  fullWidth?: boolean
  /** 입력 요소(TextInput/SelectField 등). */
  children: ReactNode
}

/**
 * 라벨 + (필수 표시) + 입력 요소를 감싸는 폼 필드 래퍼.
 * 입력 요소 종류와 무관하게 라벨 레이아웃을 일관되게 유지합니다.
 *
 * @param props - {@link FormFieldProps}
 * @returns 폼 필드 엘리먼트
 */
export default function FormField({ label, htmlFor, required, fullWidth, children }: FormFieldProps) {
  return (
    <div className={fullWidth ? 'form-field full' : 'form-field'}>
      <label htmlFor={htmlFor} className="form-label">
        {label}
        {required && <span className="req">*</span>}
      </label>
      {children}
    </div>
  )
}
