// ===== 공용 비밀번호 로그인 설정 =====
// 팀 공용 비밀번호로 접근을 제한합니다. 평문이 번들에 노출되지 않도록
// SHA-256 해시만 저장하고, 입력값의 해시와 비교합니다.
//
// 현재 비밀번호: smc-admin-2026  (변경하려면 새 비밀번호의 SHA-256 해시로 아래 값 교체)
//   생성: node -e "console.log(require('crypto').createHash('sha256').update('새비번').digest('hex'))"

/** 접근 비밀번호의 SHA-256 해시. 비우면 로그인 게이트 비활성. */
export const ACCESS_PASSWORD_SHA256 =
  '9bbdfd2fb4c8d4c945e95231895e917365e003613a886737b9fde6b04a8fb737'

/**
 * 로그인 게이트 활성 여부. 해시가 설정되어 있으면 활성.
 * @returns 게이트 활성 여부
 */
export function isAuthEnabled(): boolean {
  return Boolean(ACCESS_PASSWORD_SHA256)
}
