import { FormSection, FormField, TextInput, SelectField } from '@/components/form'
import { DEPARTMENTS, BUILDINGS } from '@/constants/organization'
import { ASSET_STATUSES } from '@/constants/asset'
import type { AssetFormControl } from '../formConfig'

/**
 * 자산 등록 - 상세 정보 섹션. (이미지 ② '상세 정보')
 * 사용자/부서/설치위치/상태/관리담당자/비고를 입력받습니다.
 *
 * @param props - 폼 제어 객체 ({@link AssetFormControl})
 * @returns 상세 정보 폼 섹션
 */
export default function DetailInfoSection({ values, setField }: AssetFormControl) {
  return (
    <FormSection title="상세 정보">
      <FormField label="사용자" htmlFor="user">
        <TextInput
          id="user"
          value={values.user}
          onChange={(v) => setField('user', v)}
          placeholder="사용자를 검색하세요"
        />
      </FormField>

      <FormField label="소속 부서" htmlFor="department">
        <SelectField
          id="department"
          value={values.department}
          onChange={(v) => setField('department', v)}
          options={DEPARTMENTS}
        />
      </FormField>

      <FormField label="설치 위치" htmlFor="location">
        <SelectField
          id="location"
          value={values.location}
          onChange={(v) => setField('location', v)}
          options={BUILDINGS}
        />
      </FormField>

      <FormField label="자산 상태" htmlFor="status" required>
        <SelectField
          id="status"
          value={values.status}
          onChange={(v) => setField('status', v)}
          options={ASSET_STATUSES}
        />
      </FormField>

      <FormField label="관리 담당자" htmlFor="manager">
        <TextInput id="manager" value={values.manager} onChange={(v) => setField('manager', v)} />
      </FormField>

      <FormField label="비고" htmlFor="note" fullWidth>
        <TextInput
          id="note"
          value={values.note}
          onChange={(v) => setField('note', v)}
          placeholder="비고를 입력하세요"
        />
      </FormField>
    </FormSection>
  )
}
