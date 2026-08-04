import type { ComponentType, LazyExoticComponent } from 'react'
import type { LucideIcon } from 'lucide-react'

/**
 * 플랫폼 모듈 정의.
 * 새 모듈을 추가하려면 이 형태의 객체를 만들어 레지스트리에 등록하면
 * 사이드바 메뉴와 라우트가 자동 생성됩니다. (확장 지점)
 */
export interface ModuleDef {
  /** 고유 식별자 (예: 'purchase'). */
  id: string
  /** 사이드바에 표시할 이름 (예: '구매·정산관리'). */
  title: string
  /** `/admin` 하위 경로 세그먼트 (예: 'purchase' → /admin/purchase). */
  path: string
  /** 사이드바 아이콘. */
  icon: LucideIcon
  /** 라우트에 렌더링할 페이지 (코드 스플릿을 위해 lazy). */
  element: LazyExoticComponent<ComponentType>
  /** 사이드바 노출 여부. 기본 true. */
  showInSidebar?: boolean
  /** 사이드바/라우트 정렬 순서 (작을수록 위). */
  order: number
}
