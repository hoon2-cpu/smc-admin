import { NavLink } from 'react-router-dom'
import { MODULES } from '@/app/registry'
import './ModuleSidebar.css'

/**
 * 좌측 모듈 네비게이션.
 * 레지스트리(MODULES)를 그대로 렌더링하므로, 모듈이 늘어나면 메뉴도 자동 확장됩니다.
 * (5단계에서 반응형 드로어/디자인 다듬기 예정)
 *
 * @returns 사이드바 엘리먼트
 */
export default function ModuleSidebar() {
  return (
    <aside className="module-sidebar">
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
