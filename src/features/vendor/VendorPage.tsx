import RoleShell from '@/components/layout/RoleShell'

/**
 * 외부 수리업체용 페이지 (골격).
 * 총무팀이 '외부업체 전달'한 수리 건 목록이 다음 단계(④)에서 여기에 표시됩니다.
 *
 * @returns 외부업체 페이지
 */
export default function VendorPage() {
  return (
    <RoleShell title="외부 수리업체">
      <p style={{ color: 'var(--color-text-sub)', fontSize: 14, lineHeight: 1.6 }}>
        총무팀이 전달한 <b>수리 요청 목록</b>이 여기에 표시됩니다. (다음 단계에서 구현)
      </p>
    </RoleShell>
  )
}
