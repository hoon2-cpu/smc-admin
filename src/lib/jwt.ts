/** 구글 ID 토큰(JWT)에서 우리가 사용하는 클레임. */
export interface GoogleJwtPayload {
  /** 이메일. */
  email?: string
  /** 이메일 인증 여부. */
  email_verified?: boolean
  /** 조직 도메인(hosted domain). Workspace 계정만 존재. */
  hd?: string
  /** 이름. */
  name?: string
  /** 프로필 사진 URL. */
  picture?: string
  /** 만료 시각(Unix seconds). */
  exp?: number
  /** 대상(클라이언트 ID). */
  aud?: string
}

/**
 * JWT의 payload를 디코드합니다. (서명 검증은 하지 않음 — 표시/도메인 확인용)
 * base64url + UTF-8을 안전하게 처리합니다.
 *
 * @param token - JWT 문자열
 * @returns 디코드된 payload, 실패 시 null
 */
export function decodeJwt(token: string): GoogleJwtPayload | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(base64)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)
    return JSON.parse(json) as GoogleJwtPayload
  } catch {
    return null
  }
}
