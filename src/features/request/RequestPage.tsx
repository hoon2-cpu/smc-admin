import RoleShell from '@/components/layout/RoleShell'

/**
 * 일반 직원용 신청 페이지 (골격).
 * 자산신청 · 수리신청 · 반납신청 폼이 다음 단계(③)에서 여기에 들어갑니다.
 *
 * @returns 직원 신청 페이지
 */
export default function RequestPage() {
  return (
    <RoleShell title="직원 신청">
      <p style={{ color: 'var(--color-text-sub)', fontSize: 14, lineHeight: 1.6 }}>
        여기에 <b>자산신청 · 수리신청 · 반납신청</b> 폼이 들어갑니다. (다음 단계에서 구현)
      </p>
    </RoleShell>
  )
}
