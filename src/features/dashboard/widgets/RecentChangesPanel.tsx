import { ArrowRight, UserCheck, RotateCcw, Wrench, RefreshCw, Coins } from 'lucide-react'
import { Card } from '@/components/ui'
import type { ChangeLogItem } from '../types'
import './RecentChangesPanel.css'

/** {@link RecentChangesPanel} 컴포넌트 props. */
interface RecentChangesPanelProps {
  /** 최근 변경 이력. */
  changes?: ChangeLogItem[]
}

/** 변경 이력 1건의 아이콘을 구분/상황에 맞게 고릅니다. */
function iconFor(c: ChangeLogItem) {
  if (c.kind === '렌탈반납') return <Coins size={15} />
  if (c.kind === '수리접수') return <Wrench size={15} />
  if (c.kind === '자산배정') return c.after === '(반납)' ? <RotateCcw size={15} /> : <UserCheck size={15} />
  return <RefreshCw size={15} />
}

/** 변경 구분을 짧은 한글 라벨로 바꿉니다. */
function labelFor(c: ChangeLogItem): string {
  if (c.kind === '자산배정') return c.after === '(반납)' ? '반납' : '불출'
  if (c.kind === '자산변경') return '상태변경'
  if (c.kind === '렌탈반납') return '렌탈반납'
  if (c.kind === '수리접수') return '수리'
  return c.kind || '변경'
}

/**
 * 최근 이동 위젯. 자산의 불출/반납·상태변경·렌탈반납 등 최근 이력을 보여줍니다.
 * (3_변경로그 기반 — 예: "홍길동 → 김춘향", "정운영 → 반납")
 *
 * @param props - {@link RecentChangesPanelProps}
 * @returns 최근 이동 카드
 */
export default function RecentChangesPanel({ changes = [] }: RecentChangesPanelProps) {
  return (
    <Card title="최근 이동 (반납 · 불출 · 상태변경)">
      <ul className="rc-list">
        {changes.length === 0 && <li className="rc-empty">최근 변경 이력이 없습니다.</li>}
        {changes.map((c, i) => (
          <li key={`${c.target}-${c.at}-${i}`} className="rc-item">
            <span className={`rc-icon rc-${c.kind}`}>{iconFor(c)}</span>
            <div className="rc-body">
              <div className="rc-line1">
                <span className="rc-tag">{labelFor(c)}</span>
                <span className="rc-target">{c.target}</span>
              </div>
              <div className="rc-line2">
                {c.before && <span className="rc-before">{c.before}</span>}
                {c.before && <ArrowRight size={12} className="rc-arrow" />}
                <span className="rc-after">{c.after || '-'}</span>
                {c.actor && <span className="rc-actor">· {c.actor}</span>}
              </div>
            </div>
            <span className="rc-date">{c.at}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
