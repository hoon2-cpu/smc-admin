import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import Modal from './Modal'
import './QrScannerModal.css'

/** {@link QrScannerModal} 컴포넌트 props. */
interface QrScannerModalProps {
  /** 닫기 콜백. */
  onClose: () => void
  /** QR 인식 성공 시 디코드된 문자열 전달. */
  onDetected: (text: string) => void
}

const READER_ID = 'qr-reader'

/**
 * 카메라로 QR을 스캔하는 모달. (조건부 마운트로 사용 — 열릴 때만 렌더)
 * 인식되면 즉시 카메라를 멈추고 onDetected로 결과를 전달합니다.
 * 보안 컨텍스트(https/localhost)에서만 카메라가 동작합니다.
 *
 * @param props - {@link QrScannerModalProps}
 * @returns QR 스캐너 모달
 */
export default function QrScannerModal({ onClose, onDetected }: QrScannerModalProps) {
  const [error, setError] = useState('')
  // 콜백을 ref에 담아 카메라 재시작 없이 최신 함수를 참조
  const onDetectedRef = useRef(onDetected)
  onDetectedRef.current = onDetected

  useEffect(() => {
    const scanner = new Html5Qrcode(READER_ID)
    let detected = false

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 240 },
        (text) => {
          if (detected) return
          detected = true
          // 인식되면 카메라 정지 후 결과 전달
          scanner
            .stop()
            .then(() => scanner.clear())
            .catch(() => {})
          onDetectedRef.current(text)
        },
        () => {
          // 프레임별 디코드 실패는 무시(계속 스캔)
        },
      )
      .catch(() => setError('카메라를 열 수 없습니다. 브라우저 카메라 권한을 확인해주세요.'))

    return () => {
      // 언마운트 시 카메라 정지(리소스 해제)
      scanner.stop().then(() => scanner.clear()).catch(() => {})
    }
  }, [])

  return (
    <Modal open title="QR 스캔" onClose={onClose}>
      <div id={READER_ID} className="qr-reader" />
      {error ? (
        <p className="qr-error">{error}</p>
      ) : (
        <p className="qr-hint">자산 라벨의 QR을 카메라에 비춰주세요.</p>
      )}
    </Modal>
  )
}
