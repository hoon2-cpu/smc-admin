import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { SIDEBAR_NODES, type NavNode } from './sidebarConfig'
import './AdminSidebar.css'

/**
 * 그룹 노드 하나를 렌더링합니다. (펼침/접힘 상태를 내부에서 관리)
 * @param node - 렌더링할 그룹 노드
 */
function SidebarGroup({ node }: { node: NavNode }) {
  const [open, setOpen] = useState(false)
  const Icon = node.icon

  return (
    <li className="nav-group">
      <button
        type="button"
        className="nav-group-head"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <Icon size={18} />
        <span className="nav-label">{node.label}</span>
        <ChevronDown size={16} className={open ? 'nav-chevron open' : 'nav-chevron'} />
      </button>

      {open && (
        <ul className="nav-sublist">
          {node.items?.map((item) => (
            <li key={item.label}>
              {/* 미구현 항목은 링크 대신 비활성 텍스트로 표시 (다음 단계에서 경로 연결) */}
              {item.to ? (
                <NavLink to={item.to} className="nav-subitem">
                  {item.label}
                </NavLink>
              ) : (
                <span className="nav-subitem disabled">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/**
 * 관리자 화면 좌측 네비게이션 사이드바. (이미지 ④)
 * 단일 링크(대시보드)와 펼침 그룹을 함께 렌더링합니다.
 *
 * @returns 사이드바 엘리먼트
 */
export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">IT 자산관리 통합 시스템</div>
      <nav>
        <ul className="nav-list">
          {SIDEBAR_NODES.map((node) => {
            const Icon = node.icon
            // 단일 링크 노드(대시보드 등)
            if (node.to) {
              return (
                <li key={node.label}>
                  <NavLink
                    to={node.to}
                    end
                    className={({ isActive }) =>
                      isActive ? 'nav-item active' : 'nav-item'
                    }
                  >
                    <Icon size={18} />
                    <span className="nav-label">{node.label}</span>
                  </NavLink>
                </li>
              )
            }
            // 그룹 노드
            return <SidebarGroup key={node.label} node={node} />
          })}
        </ul>
      </nav>
    </aside>
  )
}
