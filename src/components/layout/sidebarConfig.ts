import {
  LayoutDashboard,
  Monitor,
  Package,
  ClipboardList,
  ClipboardCheck,
  Wrench,
  BarChart3,
  Users,
  Settings,
  type LucideIcon,
} from 'lucide-react'

/** 사이드바 하위 메뉴 항목. */
export interface NavSubItem {
  /** 표시 라벨. */
  label: string
  /** 이동 경로. 아직 미구현이면 생략(클릭 비활성). */
  to?: string
}

/**
 * 사이드바 최상위 노드.
 * - `to`만 있으면 단일 링크(예: 대시보드)
 * - `items`가 있으면 펼침/접힘 그룹(예: 자산관리)
 */
export interface NavNode {
  /** 그룹/링크 라벨. */
  label: string
  /** 좌측 아이콘. */
  icon: LucideIcon
  /** 단일 링크 경로. */
  to?: string
  /** 하위 항목(그룹일 때). */
  items?: NavSubItem[]
}

/**
 * 관리자 사이드바 메뉴 구성. (이미지 ④의 좌측 네비게이션)
 * 실제 라우트가 준비된 항목만 `to`를 지정하고, 나머지는
 * 다음 단계에서 경로를 채웁니다.
 */
export const SIDEBAR_NODES: NavNode[] = [
  { label: '대시보드', icon: LayoutDashboard, to: '/admin' },
  {
    label: '자산관리',
    icon: Monitor,
    items: [
      { label: '자산목록' },
      { label: '자산등록' },
      { label: '자산현황' },
      { label: '자산이력' },
      { label: '폐기자산' },
    ],
  },
  {
    label: '소모품 관리',
    icon: Package,
    items: [
      { label: '소모품 목록' },
      { label: '재고현황' },
      { label: '입고관리' },
      { label: '출고관리' },
    ],
  },
  {
    label: '신청 관리',
    icon: ClipboardList,
    items: [
      { label: '자산 신청' },
      { label: '소모품 신청' },
      { label: '유지보수 신청' },
      { label: '구매 신청' },
    ],
  },
  { label: '승인 관리', icon: ClipboardCheck, items: [{ label: '승인 대기' }, { label: '승인 이력' }] },
  { label: '유지보수 관리', icon: Wrench, items: [{ label: '수리 접수' }, { label: '처리 이력' }] },
  { label: '보고서', icon: BarChart3, items: [{ label: '자산 보고서' }, { label: '재고 보고서' }] },
  { label: '사용자 관리', icon: Users, items: [{ label: '사용자 목록' }, { label: '권한 관리' }] },
  { label: '시스템 설정', icon: Settings, items: [{ label: '기본 설정' }, { label: '알림 설정' }] },
]
