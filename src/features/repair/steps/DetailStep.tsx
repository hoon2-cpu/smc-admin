import { FormSection, FormField, TextInput, SelectField } from '@/components/form'
import { useOrgSettings } from '@/hooks/useOrgSettings'
import type { RepairFormControl } from '../formConfig'

/**
 * 2단계 — 상세 정보. 담당자가 연락할 수 있도록 요청자 정보를 입력받습니다.
 *
 * @param props - 폼 제어 객체 ({@link RepairFormControl})
 * @returns 상세 정보 스텝
 */
export default function DetailStep({ values, setField }: RepairFormControl) {
  const { departmentOptions } = useOrgSettings()
  return (
    <FormSection title="요청자 정보">
      <FormField label="이름" htmlFor="requesterName" required>
        <TextInput
          id="requesterName"
          value={values.requesterName}
          onChange={(v) => setField('requesterName', v)}
          placeholder="이름을 입력하세요"
        />
      </FormField>

      <FormField label="소속 부서" htmlFor="department" required>
        <SelectField
          id="department"
          value={values.department}
          onChange={(v) => setField('department', v)}
          options={departmentOptions}
        />
      </FormField>

      <FormField label="연락처" htmlFor="contact" fullWidth>
        <TextInput
          id="contact"
          value={values.contact}
          onChange={(v) => setField('contact', v)}
          placeholder="예: 010-1234-5678"
        />
      </FormField>
    </FormSection>
  )
}
