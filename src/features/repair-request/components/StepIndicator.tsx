import './StepIndicator.css'

/** {@link StepIndicator} 컴포넌트 props. */
interface StepIndicatorProps {
  /** 단계 라벨 목록 (예: ['증상 입력', '상세 정보', '접수 완료']). */
  steps: string[]
  /** 현재 단계 번호 (1부터). */
  current: number
}

/**
 * 다단계 폼의 진행 상태 표시기. (이미지 ③ 상단 1-2-3)
 * 완료/현재/대기 단계를 색으로 구분합니다.
 *
 * @param props - {@link StepIndicatorProps}
 * @returns 스텝 인디케이터 엘리먼트
 */
export default function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <ol className="step-indicator">
      {steps.map((label, index) => {
        const stepNumber = index + 1
        // 지난 단계는 done, 현재 단계는 active, 나머지는 기본
        const state = stepNumber < current ? 'done' : stepNumber === current ? 'active' : ''
        return (
          <li key={label} className={`step ${state}`}>
            <span className="step-circle">{stepNumber}</span>
            <span className="step-label">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
