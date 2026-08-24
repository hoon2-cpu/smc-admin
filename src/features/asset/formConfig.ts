import type { UseFormReturn } from '@/hooks/useForm'

/**
 * 자산 등록 폼 값. (이미지 ②의 입력 항목)
 * 폼에서는 숫자/날짜도 입력 문자열로 다루므로 모두 string으로 두고,
 * 실제 저장 시점(GAS 연동)에 Asset 타입으로 변환합니다.
 */
export interface AssetRegisterFormValues {
  /** 자산명 (필수). */
  name: string
  /** 자산 분류 (필수). */
  category: string
  /** 제조사 (필수). */
  manufacturer: string
  /** 모델명. */
  model: string
  /** 시리얼 번호 / S·N. */
  serialNumber: string
  /** 업체(렌탈사 등) 부여 관리번호. */
  managementNumber: string
  /** 키값(자산 식별용 추가 키). */
  keyValue: string
  /** 취득 구분(구매/렌탈, 필수). */
  acquisitionType: string
  /** 렌탈사 (취득구분이 렌탈일 때). */
  rentalCompany: string
  /** 구매일. */
  purchaseDate: string
  /** 구매 금액 (원). */
  purchaseAmount: string
  /** 구매처. */
  vendor: string
  /** 보증기간(만료일). */
  warrantyUntil: string
  /** 사용자. */
  user: string
  /** 소속 부서. */
  department: string
  /** 설치 위치(사옥). */
  location: string
  /** 자산 상태 (필수). */
  status: string
  /** 관리 담당자. */
  manager: string
  /** 비고. */
  note: string
}

/**
 * 폼 섹션 컴포넌트가 공통으로 받는 제어 객체.
 * useForm의 반환에서 값과 필드 갱신 함수만 추려 전달합니다.
 */
export type AssetFormControl = Pick<
  UseFormReturn<AssetRegisterFormValues>,
  'values' | 'setField'
>

/** 자산 등록 폼 초기값 (모든 필드 빈 값). */
export const INITIAL_ASSET_FORM: AssetRegisterFormValues = {
  name: '',
  category: '',
  manufacturer: '',
  model: '',
  serialNumber: '',
  managementNumber: '',
  keyValue: '',
  acquisitionType: '',
  rentalCompany: '',
  purchaseDate: '',
  purchaseAmount: '',
  vendor: '',
  warrantyUntil: '',
  user: '',
  department: '',
  location: '',
  status: '',
  manager: '',
  note: '',
}
