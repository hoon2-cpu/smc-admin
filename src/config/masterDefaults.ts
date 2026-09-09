import { ASSET_CATEGORIES, RENTAL_COMPANIES } from '@/constants/asset'
import { COMMON_CONSUMABLES } from '@/constants/consumable'
import { MANUFACTURERS } from '@/constants/manufacturers'

/**
 * 코드(Master) 기본값.
 *
 * @remarks
 * 자산 구분·렌탈사·소모품 품목·제조사처럼 회사 사정에 따라 바뀌는 **선택지 코드**를
 * 코드가 아닌 Master 화면에서 관리하기 위한 시드입니다. 실제 값은 서버(시트 `9_코드마스터`)에
 * 저장되며, 폼 셀렉트는 `useMasterCodes` 훅으로 최신값을 사용합니다.
 *
 * (자산 상태·수리 우선순위/진행상태처럼 뱃지 색상 매핑과 묶인 값은 편집 대상이 아니라
 *  `constants/`에 고정으로 남깁니다 — 컴파일 타임 안전성 유지.)
 */

/** Master 코드 묶음. */
export interface MasterCodes {
  /** 자산 구분(카테고리). */
  categories: string[]
  /** 렌탈사. */
  rentalCompanies: string[]
  /** 소모품 품목. */
  consumables: string[]
  /** 제조사(제안 목록). */
  manufacturers: string[]
}

/** 코드 기본값. 기존 `constants/`를 시드로 사용. */
export const DEFAULT_MASTER_CODES: MasterCodes = {
  categories: [...ASSET_CATEGORIES],
  rentalCompanies: [...RENTAL_COMPANIES],
  consumables: [...COMMON_CONSUMABLES],
  manufacturers: [...MANUFACTURERS],
}
