import { REPAIR_PRIORITIES, type RepairPriority } from '@/constants/repair'
import './PrioritySelect.css'

/** 각 긴급도의 부가 설명. (이미지 ③ '긴급도 선택') */
const PRIORITY_DESC: Record<RepairPriority, string> = {
  긴급: '업무 불가',
  높음: '업무 지연',
  보통: '업무 지연',
  낮음: '큰 영향 없음',
}

/** {@link PrioritySelect} 컴포넌트 props. */
interface PrioritySelectProps {
  /** 현재 선택된 긴급도. */
  value: string
  /** 선택 변경 콜백. */
  onChange: (priority: RepairPriority) => void
}

/**
 * 긴급도 선택 카드 그룹. 업무 영향도를 4단계로 고릅니다.
 *
 * @param props - {@link PrioritySelectProps}
 * @returns 긴급도 선택 엘리먼트
 */
export default function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  return (
    <div className="priority-grid">
      {REPAIR_PRIORITIES.map((priority) => (
        <button
          key={priority}
          type="button"
          className={value === priority ? 'priority-card active' : 'priority-card'}
          onClick={() => onChange(priority)}
        >
          <strong>{priority}</strong>
          <span>({PRIORITY_DESC[priority]})</span>
        </button>
      ))}
    </div>
  )
}
