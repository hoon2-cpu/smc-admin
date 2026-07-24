import type { FormEvent } from 'react'
import { History } from 'lucide-react'
import MobileHeader from '@/components/layout/MobileHeader'
import { useForm } from '@/hooks/useForm'
import QrScanBanner from './QrScanBanner'
import PhotoUpload from './PhotoUpload'
import BasicInfoSection from './sections/BasicInfoSection'
import DetailInfoSection from './sections/DetailInfoSection'
import { INITIAL_ASSET_FORM } from './formConfig'
import './AssetRegisterPage.css'

/**
 * 자산 등록 페이지. (이미지 ②)
 * 폼 상태는 useForm으로 관리하고, 각 입력 섹션에 제어 객체를 전달합니다.
 * 이 페이지는 조립과 제출 처리만 담당합니다.
 *
 * @returns 자산 등록 페이지
 */
export default function AssetRegisterPage() {
  const { values, setField, reset } = useForm(INITIAL_ASSET_FORM)

  /**
   * 등록 폼 제출 처리.
   * 백엔드(GAS) 연동 전이므로 현재는 콘솔 출력으로 대체합니다.
   * (5단계에서 이 부분을 실제 저장 API 호출로 교체)
   *
   * @param event - 폼 제출 이벤트
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log('[자산 등록] 제출 값:', values)
    window.alert('자산이 등록되었습니다. (임시: 콘솔 출력)')
    reset()
  }

  return (
    <>
      <MobileHeader
        title="자산 등록"
        subtitle="QR코드를 스캔하여 자산을 등록합니다."
        rightAction={<History size={20} />}
      />

      <form className="asset-register-form" onSubmit={handleSubmit}>
        <QrScanBanner />
        <BasicInfoSection values={values} setField={setField} />
        <DetailInfoSection values={values} setField={setField} />
        <PhotoUpload />

        <button type="submit" className="register-submit">
          등록하기
        </button>
      </form>
    </>
  )
}
