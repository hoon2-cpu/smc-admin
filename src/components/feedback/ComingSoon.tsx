import { Link } from 'react-router-dom'

/** {@link ComingSoon} 컴포넌트 props. */
interface ComingSoonProps {
  /** 화면에 표시할 기능/페이지 이름. */
  title: string
}

/**
 * 아직 구현되지 않은 라우트를 위한 임시 자리표시 페이지.
 * 이후 단계에서 실제 기능 페이지로 교체됩니다.
 *
 * @param props - {@link ComingSoonProps}
 * @returns 준비 중 안내 엘리먼트
 */
export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div style={{ padding: 40 }}>
      <h2 className="page-title">{title}</h2>
      <p style={{ color: 'var(--color-text-sub)' }}>준비 중입니다. (다음 단계에서 구현)</p>
      <p style={{ marginTop: 16 }}>
        <Link to="/" style={{ color: 'var(--color-primary)' }}>
          ← 메인으로
        </Link>
      </p>
    </div>
  )
}
