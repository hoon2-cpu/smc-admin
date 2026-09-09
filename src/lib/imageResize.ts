/**
 * 이미지 파일을 캔버스로 축소해 JPEG data URL로 변환합니다.
 *
 * @remarks
 * 수리 사진을 GAS(Drive)로 업로드하기 전에 용량을 줄이기 위한 유틸입니다.
 * 원본 사진(수 MB)을 그대로 base64로 전송하면 요청이 과도하게 커지므로,
 * 긴 변 기준 최대 크기로 축소하고 JPEG로 재인코딩합니다.
 *
 * @param file - 사용자가 선택한 이미지 파일
 * @param maxDim - 긴 변 최대 픽셀 (기본 1400)
 * @param quality - JPEG 품질 0~1 (기본 0.7)
 * @returns `data:image/jpeg;base64,...` 형식의 data URL
 */
export function fileToResizedDataUrl(file: File, maxDim = 1400, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      // 긴 변이 maxDim을 넘으면 비율 유지하며 축소
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('캔버스 컨텍스트를 만들 수 없습니다.'))
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('이미지를 불러오지 못했습니다.'))
    }
    img.src = url
  })
}
