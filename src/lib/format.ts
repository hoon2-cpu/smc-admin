/**
 * 숫자를 한국 원화 표기(천단위 콤마) 문자열로 변환합니다.
 *
 * @param amount - 금액 (원 단위 정수)
 * @returns 천단위 콤마가 포함된 문자열 (예: `1690000` → `'1,690,000'`)
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR')
}

/**
 * ISO 날짜/일시 문자열에서 날짜 부분('YYYY-MM-DD')만 추출합니다.
 *
 * 구글시트는 값을 ISO 문자열로 내려주는데, 목록 표에는 날짜만 필요한
 * 경우가 많아 앞 10글자만 잘라 씁니다. (Date 파싱보다 가볍고 타임존 영향 없음)
 *
 * @param iso - ISO 날짜 또는 일시 문자열
 * @returns 날짜 부분 문자열 (예: `'2024-04-15T10:20:00'` → `'2024-04-15'`)
 */
export function formatDate(iso: string): string {
  return iso.slice(0, 10)
}

/**
 * 값이 적정 재고 미만인지(부족 상태인지) 판정합니다.
 *
 * @param currentStock - 현재 재고
 * @param threshold - 적정(최소 보유) 수량
 * @returns 현재 재고가 적정 수량보다 적으면 `true`
 */
export function isLowStock(currentStock: number, threshold: number): boolean {
  return currentStock < threshold
}
