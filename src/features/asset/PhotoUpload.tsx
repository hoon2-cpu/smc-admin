import { Camera } from 'lucide-react'
import './PhotoUpload.css'

/**
 * 자산 사진 업로드 영역. (이미지 ② '자산 사진')
 * 실제 업로드는 백엔드 연동 단계에서 처리하며, 지금은 UI 자리표시입니다.
 *
 * @returns 사진 업로드 엘리먼트
 */
export default function PhotoUpload() {
  return (
    <section className="form-section">
      <h3 className="form-section-title">자산 사진 (선택)</h3>
      <button type="button" className="photo-dropzone">
        <Camera size={26} />
        <strong>사진 촬영 / 업로드</strong>
        <span>자산의 사진을 추가해주세요.</span>
      </button>
    </section>
  )
}
