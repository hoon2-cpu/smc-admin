import { FormSection, FormField, TextInput, SelectField } from '@/components/form'
import { ASSET_CATEGORIES } from '@/constants/asset'
import { MANUFACTURERS } from '@/constants/manufacturers'
import type { AssetFormControl } from '../formConfig'

/**
 * 자산 등록 - 기본 정보 섹션. (이미지 ② '기본 정보')
 * 자산명/분류/제조사/모델/시리얼/구매일/금액/구매처/보증기간을 입력받습니다.
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

      <FormField label="구매일" htmlFor="purchaseDate" required>
        <TextInput
          id="purchaseDate"
          type="date"
          value={values.purchaseDate}
          onChange={(v) => setField('purchaseDate', v)}
        />
      </FormField>

      <FormField label="구매 금액 (원)" htmlFor="purchaseAmount">
        <TextInput
          id="purchaseAmount"
          type="number"
          value={values.purchaseAmount}
          onChange={(v) => setField('purchaseAmount', v)}
          placeholder="예: 1690000"
        />
      </FormField>

      <FormField label="구매처" htmlFor="vendor">
        <TextInput id="vendor" value={values.vendor} onChange={(v) => setField('vendor', v)} />
      </FormField>

      <FormField label="보증기간" htmlFor="warrantyUntil">
        <TextInput
          id="warrantyUntil"
          type="date"
          value={values.warrantyUntil}
          onChange={(v) => setField('warrantyUntil', v)}
        />
      </FormField>
    </FormSection>
  )
}
