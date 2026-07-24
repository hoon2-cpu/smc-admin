import type { UseFormReturn } from '@/hooks/useForm'

/**
 * 수리 요청 폼 값. (이미지 ③의 입력 항목)
 */
export interface RepairFormValues {
  /** 첨부 사진 파일명 목록 (최대 5장). */
  photos: string[]
  /** 증상 설명. */
  symptom: string
  /** 대상 자산번호. */
  assetNumber: string
  /** 대상 자산명 (선택된 자산 표시용). */
  assetName: string
  /** 긴급도. */
  priority: string
  /** 요청자 이름. */
  requesterName: string
  /** 요청자 소속 부서. */
  department: string
  /** 연락처. */
  contact: string
}

/** 수리 요청 폼 초기값. */
export const INITIAL_REPAIR_FORM: RepairFormValues = {
  photos: [],
  symptom: '',
  assetNumber: '',
  assetName: '',
  priority: '낮음',
  requesterName: '',
  department: '',
  contact: '',
}

/** 폼 섹션/스텝 컴포넌트가 공통으로 받는 제어 객체. */
export type RepairFormControl = Pick<UseFormReturn<RepairFormValues>, 'values' | 'setField'>

/** 증상 설명 최대 글자 수. */
export const SYMPTOM_MAX_LENGTH = 500

/** 첨부 사진 최대 장수. */
export const MAX_PHOTOS = 5
