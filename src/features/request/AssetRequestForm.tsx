import { useState, type FormEvent } from 'react'
import { FormSection, FormField, TextInput, SelectField } from '@/components/form'
import { useForm } from '@/hooks/useForm'
import { DEPARTMENTS } from '@/constants/organization'
import { ASSET_CATEGORIES } from '@/constants/asset'
import { submitAssetRequest } from './api'
import './RequestForm.css'

/**
 * 자산 신청 폼 (직원). 필요한 자산을 총무팀에 신청합니다.
 *
 * @returns 자산 신청 폼
 */
export default function AssetRequestForm() {
  const [saving, setSaving] = useState(false)
  const { values, setField, reset } = useForm({
    requester: '',
    department: '',
    category: '',
    spec: '',
    reason: '',
    wantDate: '',
  })

  const canSubmit = values.requester.trim() && values.department && values.category

  /** 신청 제출. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    const result = await submitAssetRequest(values)
    setSaving(false)
    if (result.ok) {
      window.alert('자산 신청이 접수되었습니다.')
      reset()
    } else {
      window.alert(`신청 실패: ${result.message ?? '알 수 없는 오류'}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormSection title="자산 신청">
        <FormField label="신청자" htmlFor="ar-name" required>
          <TextInput id="ar-name" value={values.requester} onChange={(v) => setField('requester', v)} />
        </FormField>
        <FormField label="부서" htmlFor="ar-dept" required>
          <SelectField id="ar-dept" value={values.department} onChange={(v) => setField('department', v)} options={DEPARTMENTS} />
        </FormField>
        <FormField label="자산 종류" htmlFor="ar-cat" required>
          <SelectField id="ar-cat" value={values.category} onChange={(v) => setField('category', v)} options={ASSET_CATEGORIES} />
        </FormField>
        <FormField label="희망 사양/모델" htmlFor="ar-spec">
          <TextInput id="ar-spec" value={values.spec} onChange={(v) => setField('spec', v)} placeholder="예: LG gram 16 / 16GB" />
        </FormField>
        <FormField label="희망일" htmlFor="ar-date">
          <TextInput id="ar-date" type="date" value={values.wantDate} onChange={(v) => setField('wantDate', v)} />
        </FormField>
        <FormField label="신청 사유" htmlFor="ar-reason" fullWidth>
          <TextInput id="ar-reason" value={values.reason} onChange={(v) => setField('reason', v)} placeholder="예: 신규 입사자 지급" />
        </FormField>
      </FormSection>
      <button type="submit" className="request-submit" disabled={saving || !canSubmit}>
        {saving ? '신청 중…' : '자산 신청'}
      </button>
    </form>
  )
}
