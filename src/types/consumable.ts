/**
 * 소모품 재고 1건. 관리자 대시보드의 '소모품 재고 현황(부족 항목)'에 사용됩니다.
 * (이미지 ④의 토너/용지/볼펜 등)
 */
export interface Consumable {
  /** 소모품명 (예: '토너 카트리지 (검정)'). */
  name: string
  /** 현재 재고 수량. */
  currentStock: number
  /** 적정(최소 보유) 수량. 이보다 적으면 '부족'으로 간주. */
  threshold: number
  /** 수량 단위 (예: '개', '박스'). */
  unit: string
}
