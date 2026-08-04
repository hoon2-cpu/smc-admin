import { useState } from 'react'
import { useForm } from '@/hooks/useForm'
import { formatTicketNumber } from '@/lib/ticketNumber'
import StepIndicator from './components/StepIndicator'
import SymptomStep from './steps/SymptomStep'
import DetailStep from './steps/DetailStep'
import CompleteStep from './steps/CompleteStep'
import { INITIAL_REPAIR_FORM } from './formConfig'
import { submitRepairRequest } from './submit'
import './RepairRequestPage.css'

/** 진행 단계 라벨. */
const STEPS = ['증상 입력', '상세 정보', '접수 완료']

/**
 * 수리 요청 페이지. (이미지 ③)
 * 3단계(증상→상세→완료) 흐름을 내부 상태로 관리합니다.
 *
 * @returns 수리 요청 페이지
 */
export default function RepairRequestPage() {
  const [step, setStep] = useState(1)
  const [ticketNumber, setTicketNumber] = useState('')
  const { values, setField, reset } = useForm(INITIAL_REPAIR_FORM)

  /**
   * 접수 처리. 백엔드로 전송하고 완료 단계로 이동합니다.
   * 서버가 접수번호를 부여하면 그 값을, 없으면(mock 모드) 접수 시각 기반의
   * 로컬 생성값을 사용합니다.
   */
  async function handleSubmit() {
    const result = await submitRepairRequest(values)

    // 로컬 폴백 접수번호: 서버 응답에 ticketNumber가 없을 때 사용
    const now = new Date()
    const secondsOfDay = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
    const localTicket = formatTicketNumber(now, (secondsOfDay % 9999) + 1)

    if (!result.ok) {
      window.alert(`접수에 실패했습니다: ${result.message ?? '알 수 없는 오류'}`)
      return
    }
    setTicketNumber(result.ticketNumber ?? localTicket)
    setStep(3)
  }

  /** 완료 화면에서 '새 요청' 시 폼과 단계를 초기화합니다. */
  function handleReset() {
    reset()
    setTicketNumber('')
    setStep(1)
  }

  return (
    <div className="repair-page">
      <div className="repair-intro">
        <h1>수리 요청하기</h1>
        <p>불편하신 증상을 알려주시면 빠르게 도와드리겠습니다.</p>
      </div>

      <StepIndicator steps={STEPS} current={step} />

      {step === 1 && <SymptomStep values={values} setField={setField} />}
      {step === 2 && <DetailStep values={values} setField={setField} />}
      {step === 3 && (
        <CompleteStep ticketNumber={ticketNumber} values={values} onReset={handleReset} />
      )}

      {step < 3 && (
        <div className="repair-actions">
          {step > 1 && (
            <button type="button" className="btn-prev" onClick={() => setStep(step - 1)}>
              이전
            </button>
          )}
          {step === 1 && (
            <button type="button" className="btn-next" onClick={() => setStep(2)}>
              다음 →
            </button>
          )}
          {step === 2 && (
            <button type="button" className="btn-next" onClick={handleSubmit}>
              접수하기
            </button>
          )}
        </div>
      )}
    </div>
  )
}
