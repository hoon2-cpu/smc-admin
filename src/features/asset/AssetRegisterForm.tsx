import type { FormEvent } from 'react'
import { useForm } from '@/hooks/useForm'
import QrScanBanner from './QrScanBanner'
import PhotoUpload from './PhotoUpload'
import BasicInfoSection from './sections/BasicInfoSection'
import AcquisitionInfoSection from './sections/AcquisitionInfoSection'
import DetailInfoSection from './sections/DetailInfoSection'
import { INITIAL_ASSET_FORM } from './formConfig'
import { submitAssetRegister } from './submit'
import './AssetRegisterForm.css'

/** {@link AssetRegisterForm} 컴포넌트 props. */
interface AssetRegisterFormProps {
  /** 등록 성공 시 콜백 (예: 모달 닫기 · 목록 새로고침). */
  onSuccess?: () => void
}

/**
 * 자산 등록 폼 (모달/페이지 어디서든 재사용 가능한 본문).
 * 폼 상태는 useForm으로 관리하고, 제출은 gasClient(mock 폴백)로 전송합니다.
 *
 * @param props - {@link AssetRegisterFormProps}
 * @returns 자산 등록 폼
 */
export default function AssetRegisterForm({ onSuccess }: AssetRegisterFormProps) {
  const { values, setField, reset } = useForm(INITIAL_ASSET_FORM)

  /**
   * 등록 제출 처리. 성공 시 폼을 초기화하고 onSuccess를 호출합니다.
   * @param event - 폼 제출 이벤트
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = await submitAssetRegister(values)
    if (result.ok) {
      window.alert('자산이 등록되었습니다.')
      reset()
      onSuccess?.()
    } else {
      window.alert(`등록에 실패했습니다: ${result.message ?? '알 수 없는 오류'}`)
    }
  }

  return (
    <form className="asset-register-form" onSubmit={handleSubmit}>
      <QrScanBanner />
      <BasicInfoSection values={values} setField={setField} />
      <AcquisitionInfoSection values={values} setField={setField} />
      <DetailInfoSection values={values} setField={setField} />
      <PhotoUpload />
      <button type="submit" className="register-submit">
        등록하기
      </button>
    </form>
  )
}
