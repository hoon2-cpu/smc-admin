import type { AssetRow } from '../types'

/**
 * 자산 목록 더미 데이터. (구매·렌탈 혼재 — 회사는 노트북을 주로 렌탈로 보유)
 * 추후 GAS(`?action=assets`) 연동 시 useAssets 훅의 실데이터로 대체됩니다.
 */
export const ASSET_MOCK: AssetRow[] = [
  { assetNumber: 'AST-2024-1248', name: 'MacBook Pro 16', category: '노트북', manufacturer: 'APPLE', acquisitionType: '렌탈', rentalCompany: '롯데렌탈', managementNumber: 'LT-9920-01', user: '김개발 (개발팀)', location: '1사옥', status: '사용중', acquiredDate: '2024-05-20' },
  { assetNumber: 'AST-2024-1246', name: '삼성 갤럭시북', category: '노트북', manufacturer: 'SAMSUNG', acquisitionType: '렌탈', rentalCompany: 'AI네트웍스', managementNumber: 'AIN-30271', user: '박영업 (영업팀)', location: '2사옥', status: '수리중', acquiredDate: '2024-05-19' },
  { assetNumber: 'AST-2024-1247', name: 'LG 27인치 모니터', category: '모니터', manufacturer: 'LG', acquisitionType: '구매', rentalCompany: '', managementNumber: '', user: '이기획 (기획팀)', location: '1사옥', status: '사용중', acquiredDate: '2024-05-20' },
  { assetNumber: 'AST-2024-1245', name: 'HP LaserJet', category: '프린터', manufacturer: 'HP', acquisitionType: '구매', rentalCompany: '', managementNumber: '', user: '총무팀', location: '1사옥', status: '사용중', acquiredDate: '2024-05-18' },
  { assetNumber: 'AST-2021-0456', name: 'LG gram 15', category: '노트북', manufacturer: 'LG', acquisitionType: '렌탈', rentalCompany: '롯데렌탈', managementNumber: 'LT-7710-08', user: '정운영 (운영팀)', location: '2사옥', status: '폐기예정', acquiredDate: '2021-06-15' },
  { assetNumber: 'AST-2024-1240', name: 'LENOVO 데스크탑', category: '데스크탑', manufacturer: 'LENOVO', acquisitionType: '구매', rentalCompany: '', managementNumber: '', user: '최마케팅 (마케팅팀)', location: '1사옥', status: '사용가능', acquiredDate: '2024-04-10' },
]
