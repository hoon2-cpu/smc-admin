import { NavLink } from 'react-router-dom'
import { MODULES } from '@/app/registry'
import './ModuleSidebar.css'

/** {@link ModuleSidebar} 컴포넌트 props. */
interface ModuleSidebarProps {
  /** 모바일 드로어 열림 여부. */
  open?: boolean
  /** 메뉴 클릭 시 콜백(모바일 드로어 닫기용). */
  onNavigate?: () => void
}

/**
 * 좌측 모듈 네비게이션.
 * 레지스트리(MODULES)를 렌더링하며, 모바일에서는 드로어로 여닫힙니다.
 *
 * @param props - {@link ModuleSidebarProps}
 * @returns 사이드바 엘리먼트
 */
export default function ModuleSidebar({ open = false, onNavigate }: ModuleSidebarProps) {
  return (
    <aside className={open ? 'module-sidebar open' : 'module-sidebar'}>
      <div className="ms-brand">
        The SMC
        <span>Admin Platform</span>
      </div>
      <nav>
        <ul>
          {MODULES.filter((m) => m.showInSidebar !== false).map((module) => {
            const Icon = module.icon
            return (
              <li key={module.id}>
                <NavLink
                  to={`/admin/${module.path}`}
                  className={({ isActive }) => (isActive ? 'ms-link active' : 'ms-link')}
                  onClick={onNavigate}
                >
                  <Icon size={18} />
                  <span>{module.title}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
