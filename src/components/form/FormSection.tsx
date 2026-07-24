import type { ReactNode } from 'react'
import './form.css'

/** {@link FormSection} 컴포넌트 props. */
interface FormSectionProps {
  /** 섹션 제목 (예: '기본 정보'). */
  title: string
  /** 섹션 안의 폼 필드들. */
  children: ReactNode
}

/**
 * 제목이 달린 폼 섹션. 내부 필드를 2열 그리드로 배치합니다.
 *
 * @param props - {@link FormSectionProps}
 * @returns 폼 섹션 엘리먼트
 */
export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <section className="form-section">
      <h3 className="form-section-title">{title}</h3>
      <div className="form-fields">{children}</div>
    </section>
  )
}
