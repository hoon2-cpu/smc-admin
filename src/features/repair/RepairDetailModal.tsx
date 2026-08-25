import { useState } from 'react'
import { Modal, Badge } from '@/components/ui'
import { FormField, TextInput, SelectField } from '@/components/form'
import { useForm } from '@/hooks/useForm'
import { getRepairStatusVariant } from '@/lib/badgeVariant'
import { REPAIR_STATUSES, type RepairStatus } from '@/constants/repair'
import { updateRepair } from './api'
import type { RepairRow } from './types'
import './RepairDetailModal.css'

/** {@link RepairDetailModal} 컴포넌트 props. */
interface RepairDetailModalProps {
  /** 표시/편집할 접수. null이면 렌더 안 함. */
  repair: RepairRow | null
  /** 닫기 콜백. */
  onClose: () => void
  /** 저장 성공 시 로컬 목록 갱신 콜백. */
  onSaved: (ticketNumber: string, patch: Partial<RepairRow>) => void
}

/**
 * 수리 접수 상세 + 상태/담당자 변경 모달.
 * 접수 정보를 보여주고, 진행 상태(접수→수리중→완료)와 담당자를 바꿔 저장합니다.
 *
 * @param props - {@link RepairDetailModalProps}
 * @returns 상세/수정 모달 (repair가 null이면 렌더 안 함)
 */
export default function RepairDetailModal({ repair, onClose, onSaved }: RepairDetailModalProps) {
  const [saving, setSaving] = useState(false)
  const { values, setField } = useForm({
    status: repair?.status ?? '접수',
    assignee: repair?.assignee ?? '',
  })

  if (!repair) return null

  /** 저장 처리. GAS 수정 요청 후 성공하면 로컬 목록을 갱신합니다. */
  async function handleSave() {
    if (!repair) return
    setSaving(true)
    const result = await updateRepair({
      ticketNumber: repair.ticketNumber,
      status: values.status,
      assignee: values.assignee,
    })
    setSaving(false)
    if (result.ok) {
      onSaved(repair.ticketNumber, { status: values.status, assignee: values.assignee })
      onClose()
    } else {
      window.alert(`저장 실패: ${result.message ?? '알 수 없는 오류'}`)
    }
  }

  const footer = (
    <>
      <button type="button" className="rd-btn" onClick={onClose} disabled={saving}>
        닫기
      </button>
      <button type="button" className="rd-btn primary" onClick={handleSave} disabled={saving}>
        {saving ? '저장 중…' : '저장'}
      </button>
    </>
  )

  return (
    <Modal open title={`${repair.ticketNumber} · 수리 접수`} onClose={onClose} footer={footer}>
      <dl className="rd-grid">
        <div>
          <dt>접수일</dt>
          <dd>{repair.receivedAt}</dd>
        </div>
        <div>
          <dt>접수자</dt>
          <dd>
            {repair.requester} {repair.department && `(${repair.department})`}
          </dd>
        </div>
        <div>
          <dt>자산</dt>
          <dd>
            {repair.assetNumber} {repair.assetName && `· ${repair.assetName}`}
          </dd>
        </div>
        <div>
          <dt>우선순위</dt>
          <dd>{repair.priority}</dd>
        </div>
        <div className="rd-full">
          <dt>증상</dt>
          <dd>{repair.symptom}</dd>
        </div>
        <div>
          <dt>현재 상태</dt>
          <dd>
            <Badge variant={getRepairStatusVariant(repair.status)}>{repair.status}</Badge>
          </dd>
        </div>
      </dl>

      <div className="rd-edit">
        <FormField label="진행 상태" htmlFor="r-status" required>
          <SelectField
            id="r-status"
            value={values.status}
            onChange={(v) => setField('status', v as RepairStatus)}
            options={REPAIR_STATUSES}
          />
        </FormField>
        <FormField label="담당자" htmlFor="r-assignee">
          <TextInput
            id="r-assignee"
            value={values.assignee}
            onChange={(v) => setField('assignee', v)}
            placeholder="담당자 이름"
          />
        </FormField>
      </div>
    </Modal>
  )
}
