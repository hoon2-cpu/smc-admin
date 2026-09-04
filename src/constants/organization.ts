import { DEFAULT_DIVISIONS, DEFAULT_LOCATIONS } from '@/config/orgDefaults'
import { flattenDivisions } from '@/app/orgSettings'

/**
 * 조직 상수(부서/사용위치).
 *
 * @remarks
 * 부서·위치는 회사 개편이 잦아 **설정 화면에서 관리자가 수정/추가**하며
 * 실제 값은 localStorage 오버라이드로 관리됩니다. ({@link @/hooks/useOrgSettings})
 * 아래 상수는 오버라이드가 없을 때의 **기본값**이며, 폼 셀렉트는 훅을 통해
 * 최신 값을 사용합니다. 타입은 사용자 편집을 허용하므로 문자열로 둡니다.
 */

/** 사용위치 기본값(사옥·층). */
export const BUILDINGS = DEFAULT_LOCATIONS

/** 사용위치 타입(사용자 편집 가능 → string). */
export type Building = string

/** 부서 기본값(본부→팀을 평탄화한 팀 목록). */
export const DEPARTMENTS = flattenDivisions(DEFAULT_DIVISIONS)

/** 부서 타입(사용자 편집 가능 → string). */
export type Department = string
