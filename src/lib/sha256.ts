/**
 * 문자열의 SHA-256 해시를 16진수 문자열로 반환합니다. (Web Crypto)
 * 보안 컨텍스트(https 또는 localhost)에서 동작합니다.
 *
 * @param text - 해싱할 문자열
 * @returns 소문자 16진수 해시 (64자)
 */
export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
