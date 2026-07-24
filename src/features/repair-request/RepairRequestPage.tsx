import { useState } from 'react'
import { useForm } from '@/hooks/useForm'
import { formatTicketNumber } from '@/lib/ticketNumber'
import StepIndicator from './components/StepIndicator'
import SymptomStep from './steps/SymptomStep'
import DetailStep from './steps/DetailStep'
import CompleteStep from './steps/CompleteStep'
import { INITIAL_REPAIR_FORM } from './formConfig'
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
   * 접수 처리. 접수번호를 발급하고 완료 단계로 이동합니다.
   * 순번은 실제로는 서버가 부여하므로, 여기서는 접수 시각 기반의 데모 값을 씁니다.
   * (GAS 연동 시 이 부분을 저장 API 호출로 교체)
   */
  function handleSubmit() {
    const now = new Date()
    const secondsOfDay = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
    const sequence = (secondsOfDay % 9999) + 1
    const ticket = formatTicketNumber(now, sequence)
    setTicketNumber(ticket)
    console.log('[수리 요청] 접수:', ticket, values)
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
