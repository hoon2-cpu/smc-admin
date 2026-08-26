import { useState, type FormEvent } from 'react'
import { FormSection, FormField, TextInput, SelectField } from '@/components/form'
import { useForm } from '@/hooks/useForm'
import { DEPARTMENTS } from '@/constants/organization'
import { submitReturnRequest } from './api'
import './RequestForm.css'

/** 반납 사유 선택지. */
const RETURN_REASONS = ['퇴사', '부서이동', '불용', '고장', '기타'] as const

/**
 * 반납 신청 폼 (직원). 사용 중인 자산의 반납을 총무팀에 신청합니다.
 *
 * @returns 반납 신청 폼
 */
export default function ReturnRequestForm() {
  const [saving, setSaving] = useState(false)
  const { values, setField, reset } = useForm({
    requester: '',
    department: '',
    assetNumber: '',
    assetName: '',
    reason: '',
    note: '',
  })

  const canSubmit = values.requester.trim() && values.department && values.assetNumber.trim()

  /** 신청 제출. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    const result = await submitReturnRequest(values)
    setSaving(false)
    if (result.ok) {
      window.alert('반납 신청이 접수되었습니다.')
      reset()
    } else {
      window.alert(`신청 실패: ${result.message ?? '알 수 없는 오류'}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormSection title="반납 신청">
        <FormField label="신청자" htmlFor="rr-name" required>
          <TextInput id="rr-name" value={values.requester} onChange={(v) => setField('requester', v)} />
        </FormField>
        <FormField label="부서" htmlFor="rr-dept" required>
          <SelectField id="rr-dept" value={values.department} onChange={(v) => setField('department', v)} options={DEPARTMENTS} />
        </FormField>
        <FormField label="자산번호" htmlFor="rr-num" required>
          <TextInput id="rr-num" value={values.assetNumber} onChange={(v) => setField('assetNumber', v)} placeholder="예: AST-2026-0001" />
        </FormField>
        <FormField label="자산명" htmlFor="rr-name2">
          <TextInput id="rr-name2" value={values.assetName} onChange={(v) => setField('assetName', v)} />
        </FormField>
        <FormField label="반납 사유" htmlFor="rr-reason">
          <SelectField id="rr-reason" value={values.reason} onChange={(v) => setField('reason', v)} options={RETURN_REASONS} />
        </FormField>
        <FormField label="비고" htmlFor="rr-note" fullWidth>
          <TextInput id="rr-note" value={values.note} onChange={(v) => setField('note', v)} />
        </FormField>
      </FormSection>
      <button type="submit" className="request-submit" disabled={saving || !canSubmit}>
        {saving ? '신청 중…' : '반납 신청'}
      </button>
    </form>
  )
}
