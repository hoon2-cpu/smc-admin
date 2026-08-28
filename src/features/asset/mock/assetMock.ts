import type { AssetRow } from '../types'

/**
 * 자산 목록 더미 데이터. (구매·렌탈 혼재 — 회사는 노트북을 주로 렌탈로 보유)
 * 추후 GAS(`?action=assets`) 연동 시 useAssets 훅의 실데이터로 대체됩니다.
 */
export const ASSET_MOCK: AssetRow[] = [
  {
    assetNumber: 'AST-2024-1248', name: 'MacBook Pro 16', category: '노트북', manufacturer: 'APPLE',
    model: 'MK1E3KH/A', serialNumber: 'C02X<SN>001', managementNumber: 'LT-9920-01', keyValue: 'KEY-1248',
    acquisitionType: '렌탈', rentalCompany: '롯데렌탈', acquiredDate: '2024-05-20', purchaseAmount: '',
    vendor: '', warrantyUntil: '', user: '김개발', department: '개발팀', location: '1사옥',
    status: '사용중', manager: '이관리', note: '', disposalDate: '',
  },
  {
    assetNumber: 'AST-2024-1246', name: '삼성 갤럭시북', category: '노트북', manufacturer: 'SAMSUNG',
    model: 'NT750XDA', serialNumber: 'SN-30271', managementNumber: 'AIN-30271', keyValue: 'KEY-1246',
    acquisitionType: '렌탈', rentalCompany: 'AJ네트웍스', acquiredDate: '2024-05-19', purchaseAmount: '',
    vendor: '', warrantyUntil: '', user: '박영업', department: '영업팀', location: '2사옥',
    status: '수리중', manager: '이관리', note: '키보드 불량 접수', disposalDate: '',
  },
  {
    assetNumber: 'AST-2024-1247', name: 'LG 27인치 모니터', category: '모니터', manufacturer: 'LG',
    model: '27UL500', serialNumber: 'SN-27UL', managementNumber: '', keyValue: '',
    acquisitionType: '구매', rentalCompany: '', acquiredDate: '2024-05-20', purchaseAmount: '259000',
    vendor: 'LG전자', warrantyUntil: '2026-05-19', user: '이기획', department: '기획팀', location: '1사옥',
    status: '사용중', manager: '이관리', note: '', disposalDate: '',
  },
  {
    assetNumber: 'AST-2024-1245', name: 'HP LaserJet', category: '프린터', manufacturer: 'HP',
    model: 'M404dn', serialNumber: 'SN-M404', managementNumber: '', keyValue: '',
    acquisitionType: '구매', rentalCompany: '', acquiredDate: '2024-05-18', purchaseAmount: '349000',
    vendor: 'HP스토어', warrantyUntil: '2026-05-17', user: '', department: '경영지원팀', location: '1사옥',
    status: '사용중', manager: '박엔지니어', note: '공용 프린터', disposalDate: '',
  },
  {
    assetNumber: 'AST-2021-0456', name: 'LG gram 15', category: '노트북', manufacturer: 'LG',
    model: '15Z90N', serialNumber: 'SN-7710', managementNumber: 'LT-7710-08', keyValue: 'KEY-0456',
    acquisitionType: '렌탈', rentalCompany: '롯데렌탈', acquiredDate: '2021-06-15', purchaseAmount: '',
    vendor: '', warrantyUntil: '', user: '정운영', department: '경영지원팀', location: '2사옥',
    status: '폐기예정', manager: '이관리', note: '내용연수 만료', disposalDate: '',
  },
]
