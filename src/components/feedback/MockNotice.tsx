import './feedback.css'

/** {@link MockNotice} 컴포넌트 props. */
interface MockNoticeProps {
  /** 안내 문구. 기본 문구 제공. */
  message?: string
}

/**
 * 샘플(mock) 데이터 표시 중임을 알리는 공통 배너.
 * 실데이터 조회 실패/미배포/빈 응답 시 mock 폴백 상태를 일관되게 안내합니다.
 *
 * @param props - {@link MockNoticeProps}
 * @returns 안내 배너
 */
export default function MockNotice({
  message = '샘플(mock) 데이터 표시 중 — 실제 데이터가 쌓이면 자동 반영됩니다.',
}: MockNoticeProps) {
  return <p className="mock-notice">{message}</p>
}
