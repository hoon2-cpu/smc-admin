// ===== 구글 로그인(회사 계정 제한) 설정 =====

/**
 * Google OAuth 웹 클라이언트 ID. (공개 값이라 코드에 두어도 안전)
 * `.env`의 VITE_GOOGLE_CLIENT_ID로 재정의 가능.
 */
export const GOOGLE_CLIENT_ID: string =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ??
  '224586262699-b4cq30ggma12dutm8jtg3e656e8iohae.apps.googleusercontent.com'

/** 로그인 허용 이메일 도메인. 이 도메인 계정만 통과합니다. */
export const ALLOWED_EMAIL_DOMAIN = 'thesmc.co.kr'

/**
 * 로그인 게이트 활성화 여부. 클라이언트 ID가 있으면 활성.
 * (비우면 로컬 개발 시 게이트 없이 바로 접근)
 * @returns 게이트 활성 여부
 */
export function isAuthEnabled(): boolean {
  return Boolean(GOOGLE_CLIENT_ID)
}
