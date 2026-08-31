import type { AssetStatus, AcquisitionType } from '@/constants/asset'

/** 자산 1건 (목록/상세 공용 뷰모델). GAS `?action=assets` 응답 형태와 일치. */
export interface AssetRow {
  /** 내부 자산번호. */
  assetNumber: string
  /** 자산명. */
  name: string
  /** 자산 구분. */
  category: string
  /** 제조사. */
  manufacturer: string
  /** 모델명. */
  model: string
  /** 시리얼 번호. */
  serialNumber: string
  /** 업체 부여 관리번호. */
  managementNumber: string
  /** 키값. */
  keyValue: string
  /** 취득 구분(구매/렌탈). */
  acquisitionType: AcquisitionType
  /** 렌탈사 (렌탈일 때). */
  rentalCompany: string
  /** 취득일. */
  acquiredDate: string
  /** 구매 금액(문자열). */
  purchaseAmount: string
  /** 구매처. */
  vendor: string
  /** 보증 만료일. */
  warrantyUntil: string
  /** 사용자. */
  user: string
  /** 소속 부서. */
  department: string
  /** 설치 위치. */
  location: string
  /** 자산 상태. */
  status: AssetStatus
  /** 관리 담당자. */
  manager: string
  /** 비고. */
  note: string
  /** 폐기일 (폐기 처리 시). */
  disposalDate: string
  /** 월 렌탈료(원, 렌탈 자산). 문자열. */
  monthlyRent: string
  /** 렌탈 계약 시작일. */
  contractStart: string
  /** 렌탈 계약 종료일. */
  contractEnd: string
  /** 렌탈 반납일(반납 시 기록 → 비용지출 종료). */
  returnDate: string
}

/** 자산 상태별 요약. */
export interface AssetSummary {
  /** 전체 대수. */
  total: number
  /** 사용 중. */
  inUse: number
  /** 수리 중. */
  repairing: number
  /** 폐기 예정/폐기. */
  disposal: number
}

/** 자산 수정 시 전송하는 편집 가능 필드. */
export interface AssetUpdatePayload {
  assetNumber: string
  user: string
  department: string
  location: string
  status: string
  manager: string
  note: string
  disposalDate: string
  /** 월 렌탈료(렌탈 자산 수정 시에만 전송 — 미포함 시 서버가 기존값 보존). */
  monthlyRent?: string
  /** 렌탈 계약 시작일(선택 전송). */
  contractStart?: string
  /** 렌탈 계약 종료일(선택 전송). */
  contractEnd?: string
}

/** 렌탈 반납 요청 값. */
export interface RentalReturnPayload {
  /** 반납할 자산번호. */
  assetNumber: string
  /** 월 렌탈료(로그용). */
  monthlyRent: string
  /** 렌탈사(로그용). */
  rentalCompany: string
  /** 처리 담당자(로그용). */
  manager: string
}
