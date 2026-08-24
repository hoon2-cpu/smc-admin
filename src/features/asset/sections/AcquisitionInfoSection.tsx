import { FormSection, FormField, TextInput, SelectField } from '@/components/form'
import { ACQUISITION_TYPES, RENTAL_COMPANIES } from '@/constants/asset'
import type { AssetFormControl } from '../formConfig'

/**
 * 자산 등록 - 취득 정보 섹션.
 * 구매/렌탈 구분과 그에 따른 정보를 입력받습니다.
 * 렌탈이면 렌탈사를, 구매면 구매일/금액/구매처/보증기간을 노출합니다.
 * (조건부 노출로 불필요한 입력칸을 숨겨 혼선을 줄임)
 *
 * @param props - 폼 제어 객체 ({@link AssetFormControl})
 * @returns 취득 정보 폼 섹션
 */
export default function AcquisitionInfoSection({ values, setField }: AssetFormControl) {
  const isRental = values.acquisitionType === '렌탈'
  const isPurchase = values.acquisitionType === '구매'

  return (
    <FormSection title="취득 정보">
      <FormField label="취득 구분" htmlFor="acquisitionType" required>
        <SelectField
          id="acquisitionType"
          value={values.acquisitionType}
          onChange={(v) => setField('acquisitionType', v)}
          options={ACQUISITION_TYPES}
        />
      </FormField>

      {/* 렌탈일 때만 렌탈사 선택 */}
      {isRental && (
        <FormField label="렌탈사" htmlFor="rentalCompany" required>
          <SelectField
            id="rentalCompany"
            value={values.rentalCompany}
            onChange={(v) => setField('rentalCompany', v)}
            options={RENTAL_COMPANIES}
          />
        </FormField>
      )}

      {/* 구매일은 공통(취득일 성격)으로 항상 표시 */}
      <FormField label={isRental ? '렌탈 시작일' : '구매일'} htmlFor="purchaseDate">
        <TextInput
          id="purchaseDate"
          type="date"
          value={values.purchaseDate}
          onChange={(v) => setField('purchaseDate', v)}
        />
      </FormField>

      {/* 구매일 때만 금액/구매처/보증 노출 */}
      {isPurchase && (
        <>
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
        </>
      )}
    </FormSection>
  )
}
