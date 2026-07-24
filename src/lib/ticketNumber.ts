/**
 * 수리 접수번호를 생성합니다. 형식: `R-YYYY-MMDD-####`
 *
 * 날짜를 인자로 받도록 설계해(순수 함수) 테스트에서 시간에 의존하지 않게 했습니다.
 *
 * @param date - 접수 기준 일시
 * @param sequence - 당일 접수 순번 (1부터 시작)
 * @returns 접수번호 문자열 (예: `'R-2024-0517-0001'`)
 */
export function formatTicketNumber(date: Date, sequence: number): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const seq = String(sequence).padStart(4, '0')
  return `R-${year}-${month}${day}-${seq}`
}
