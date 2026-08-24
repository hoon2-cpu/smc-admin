import type { AssetRow } from '../types'

/**
 * 자산 목록 더미 데이터.
 * 추후 GAS(`?action=assets`) 연동 시 이 값은 useAssets 훅의 실데이터로 대체됩니다.
 */
export const ASSET_MOCK: AssetRow[] = [
  { assetNumber: 'AST-2024-1248', name: 'MacBook Pro 16', category: '노트북', manufacturer: 'APPLE', user: '김개발 (개발팀)', location: '1사옥', status: '사용중', acquiredDate: '2024-05-20' },
  { assetNumber: 'AST-2024-1247', name: 'LG 27인치 모니터', category: '모니터', manufacturer: 'LG', user: '이기획 (기획팀)', location: '1사옥', status: '사용중', acquiredDate: '2024-05-20' },
  { assetNumber: 'AST-2024-1246', name: '삼성 노트북', category: '노트북', manufacturer: 'SAMSUNG', user: '박영업 (영업팀)', location: '2사옥', status: '수리중', acquiredDate: '2024-05-19' },
  { assetNumber: 'AST-2024-1245', name: 'HP LaserJet', category: '프린터', manufacturer: 'HP', user: '총무팀', location: '1사옥', status: '사용중', acquiredDate: '2024-05-18' },
  { assetNumber: 'AST-2021-0456', name: 'Dell 노트북', category: '노트북', manufacturer: 'HP', user: '정운영 (운영팀)', location: '2사옥', status: '폐기예정', acquiredDate: '2021-06-15' },
  { assetNumber: 'AST-2024-1240', name: 'LENOVO 데스크탑', category: '데스크탑', manufacturer: 'LENOVO', user: '최마케팅 (마케팅팀)', location: '1사옥', status: '사용가능', acquiredDate: '2024-04-10' },
]
