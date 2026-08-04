import { QrCode } from 'lucide-react'
import './QrScanBanner.css'

/**
 * QR코드 스캔 안내 배너. (이미지 ② 상단)
 * 실제 카메라 스캔 기능은 이후 단계에서 연결하며, 지금은 UI만 제공합니다.
 *
 * @returns QR 스캔 배너 엘리먼트
 */
export default function QrScanBanner() {
  return (
    <div className="qr-banner">
      <span className="qr-icon">
        <QrCode size={26} />
      </span>
      <div className="qr-text">
        <strong>QR코드 스캔</strong>
        <span>자산의 QR코드를 스캔해주세요.</span>
      </div>
      <button type="button" className="qr-scan-btn">
        스캔하기
      </button>
    </div>
  )
}
