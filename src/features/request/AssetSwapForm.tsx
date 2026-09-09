import { useState, type FormEvent } from 'react'
import { FormSection, FormField, TextInput, SelectField } from '@/components/form'
import { useForm } from '@/hooks/useForm'
import { useOrgSettings } from '@/hooks/useOrgSettings'
import { useMasterCodes } from '@/hooks/useMasterCodes'
import { submitAssetSwap } from './api'
import './RequestForm.css'

/** 교체 사유 선택지. */
const SWAP_REASONS = ['고장', '노후(내용연수 초과)', '사양 부족', '파손', '분실', '기타'] as const

/**
 * 자산 교체 신청 폼 (직원). 사용 중인 자산을 다른 자산으로 교체 요청합니다.
 * 교체는 자주 발생하므로 신청 이력을 `6_신청기록`(종류=자산교체)에 남깁니다.
 *
 * @returns 자산 교체 신청 폼
 */
export default function AssetSwapForm() {
  const [saving, setSaving] = useState(false)
  const { departmentOptions } = useOrgSettings()
  const { codes } = useMasterCodes()
  const { values, setField, reset } = useForm({
    requester: '',
    department: '',
    assetNumber: '',
    assetName: '',
    category: '',
    reason: '',
    note: '',
  })

  const canSubmit = values.requester.trim() && values.department && values.assetNumber.trim()

  /** 신청 제출. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    const result = await submitAssetSwap(values)
    setSaving(false)
    if (result.ok) {
      window.alert('자산 교체 신청이 접수되었습니다.')
      reset()
    } else {
      window.alert(`신청 실패: ${result.message ?? '알 수 없는 오류'}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormSection title="자산 교체 신청">
        <FormField label="신청자" htmlFor="sw-name" required>
          <TextInput id="sw-name" value={values.requester} onChange={(v) => setField('requester', v)} />
        </FormField>
        <FormField label="부서" htmlFor="sw-dept" required>
          <SelectField id="sw-dept" value={values.department} onChange={(v) => setField('department', v)} options={departmentOptions} />
        </FormField>
        <FormField label="기존 자산번호" htmlFor="sw-num" required>
          <TextInput id="sw-num" value={values.assetNumber} onChange={(v) => setField('assetNumber', v)} placeholder="예: AST-2026-0001" />
        </FormField>
        <FormField label="기존 자산명" htmlFor="sw-name2">
          <TextInput id="sw-name2" value={values.assetName} onChange={(v) => setField('assetName', v)} placeholder="예: 노트북 (LG gram)" />
        </FormField>
        <FormField label="교체 희망 품목" htmlFor="sw-cat">
          <SelectField id="sw-cat" value={values.category} onChange={(v) => setField('category', v)} options={codes.categories} />
        </FormField>
        <FormField label="교체 사유" htmlFor="sw-reason" required>
          <SelectField id="sw-reason" value={values.reason} onChange={(v) => setField('reason', v)} options={SWAP_REASONS} />
        </FormField>
        <FormField label="비고" htmlFor="sw-note" fullWidth>
          <TextInput id="sw-note" value={values.note} onChange={(v) => setField('note', v)} placeholder="증상·요청사항 등" />
        </FormField>
      </FormSection>
      <button type="submit" className="request-submit" disabled={saving || !canSubmit}>
        {saving ? '신청 중…' : '자산 교체 신청'}
      </button>
    </form>
  )
}
