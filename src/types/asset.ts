import type { Manufacturer } from '@/constants/manufacturers'
import type { AssetCategory, AssetStatus, AcquisitionType, RentalCompany } from '@/constants/asset'
import type { Building, Department } from '@/constants/organization'

/**
 * 자산 1건. 구글시트 `2_자산등록기록` / `4_자산목록` 시트의 한 행에 대응합니다.
 * (이미지 ②의 자산 등록 폼에서 입력되는 필드와 1:1로 매칭)
 */
export interface Asset {
  /** 자산번호 (고유 식별자, 예: 'A-2034', 'AST-2024-1248'). */
  assetNumber: string
  /** 자산명 (예: '노트북 (LG gram 16)'). */
  name: string
  /** 자산 구분(카테고리). */
  category: AssetCategory
  /** 제조사. */
  manufacturer: Manufacturer
  /** 모델명 (예: '16Z90Q-GA7CK'). */
  model: string
  /** 시리얼 번호 / S·N. */
  serialNumber: string
  /** 취득 구분(구매/렌탈). */
  acquisitionType: AcquisitionType
  /** 렌탈사. 구매 자산이면 빈 문자열. */
  rentalCompany: RentalCompany | ''
  /** 업체(렌탈사 등) 부여 관리번호. 내부 자산번호와 별개. */
  managementNumber: string
  /** 키값(자산 식별용 추가 키). */
  keyValue: string
  /** 구매일 (ISO 날짜, 'YYYY-MM-DD'). */
  purchaseDate: string
  /** 구매 금액 (원 단위 정수). */
  purchaseAmount: number
  /** 구매처 (예: 'LG전자 온라인 스토어'). */
  vendor: string
  /** 보증 만료일 (ISO 날짜). */
  warrantyUntil: string
  /** 사용자 이름. 미배정 시 빈 문자열. */
  user: string
  /** 소속 부서. */
  department: Department
  /** 위치한 사옥. */
  building: Building
  /** 세부 설치 위치 (예: '5층 / 경영지원팀'). */
  location: string
  /** 자산 상태. */
  status: AssetStatus
  /** 관리 담당자. */
  manager: string
  /** 비고. */
  note: string
  /** 등록 일시 (ISO datetime). */
  registeredAt: string
}
