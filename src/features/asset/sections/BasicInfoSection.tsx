import { FormSection, FormField, TextInput, SelectField } from '@/components/form'
import { ASSET_CATEGORIES } from '@/constants/asset'
import { MANUFACTURERS } from '@/constants/manufacturers'
import type { AssetFormControl } from '../formConfig'

/**
 * 자산 등록 - 기본 정보 섹션.
 * 자산명/분류/제조사/모델/시리얼/관리번호/키값 등 자산 식별 정보를 입력받습니다.
 * (취득 구분·구매/렌탈 정보는 AcquisitionInfoSection에서 별도 입력)
 *
 * @param props - 폼 제어 객체 ({@link AssetFormControl})
 * @returns 기본 정보 폼 섹션
 */
export default function BasicInfoSection({ values, setField }: AssetFormControl) {
  return (
    <FormSection title="기본 정보">
      <FormField label="자산명" htmlFor="name" required fullWidth>
        <TextInput
          id="name"
          value={values.name}
          onChange={(v) => setField('name', v)}
          placeholder="예: 노트북 (LG gram 16)"
          clearable
        />
      </FormField>

      <FormField label="자산 분류" htmlFor="category" required>
        <SelectField
          id="category"
          value={values.category}
          onChange={(v) => setField('category', v)}
          options={ASSET_CATEGORIES}
        />
      </FormField>

      <FormField label="제조사" htmlFor="manufacturer" required>
        <SelectField
          id="manufacturer"
          value={values.manufacturer}
          onChange={(v) => setField('manufacturer', v)}
          options={MANUFACTURERS}
        />
      </FormField>

      <FormField label="모델명" htmlFor="model">
        <TextInput
          id="model"
          value={values.model}
          onChange={(v) => setField('model', v)}
          placeholder="예: 16Z90Q-GA7CK"
        />
      </FormField>

      <FormField label="시리얼 번호 / S·N" htmlFor="serialNumber">
        <TextInput
          id="serialNumber"
          value={values.serialNumber}
          onChange={(v) => setField('serialNumber', v)}
        />
      </FormField>

      <FormField label="관리번호 (업체 부여)" htmlFor="managementNumber">
        <TextInput
          id="managementNumber"
          value={values.managementNumber}
          onChange={(v) => setField('managementNumber', v)}
          placeholder="렌탈사 등 부여 번호"
        />
      </FormField>

      <FormField label="키값" htmlFor="keyValue">
        <TextInput
          id="keyValue"
          value={values.keyValue}
          onChange={(v) => setField('keyValue', v)}
        />
      </FormField>
    </FormSection>
  )
}
