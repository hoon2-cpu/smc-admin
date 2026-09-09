import { useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'
import { fileToResizedDataUrl } from '@/lib/imageResize'
import type { RepairPhoto } from '../formConfig'
import './PhotoUploadMulti.css'

/** {@link PhotoUploadMulti} 컴포넌트 props. */
interface PhotoUploadMultiProps {
  /** 현재 첨부된 사진 목록. */
  photos: RepairPhoto[]
  /** 목록 변경 콜백. */
  onChange: (photos: RepairPhoto[]) => void
  /** 최대 첨부 장수. */
  max: number
}

/**
 * 다중 사진 업로드 영역. (이미지 ③ '사진 업로드')
 * 선택한 이미지를 브라우저에서 축소(JPEG data URL)해 목록에 담고 썸네일을 보여줍니다.
 * 실제 저장은 제출 시 GAS가 Google Drive에 업로드합니다.
 *
 * @param props - {@link PhotoUploadMultiProps}
 * @returns 사진 업로드 엘리먼트
 */
export default function PhotoUploadMulti({ photos, onChange, max }: PhotoUploadMultiProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [working, setWorking] = useState(false)

  /**
   * 파일 선택 시 각 이미지를 축소해 목록에 추가합니다. (max 초과분은 잘라냄)
   * @param fileList - input이 선택한 파일 목록
   */
  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setWorking(true)
    try {
      const room = Math.max(0, max - photos.length)
      const picked = Array.from(fileList).slice(0, room)
      const added = await Promise.all(
        picked.map(async (file) => ({ name: file.name, dataUrl: await fileToResizedDataUrl(file) })),
      )
      onChange([...photos, ...added])
    } catch {
      window.alert('일부 이미지를 처리하지 못했습니다. 다른 파일로 시도해주세요.')
    } finally {
      setWorking(false)
      if (inputRef.current) inputRef.current.value = '' // 같은 파일 재선택 허용
    }
  }

  /**
   * 특정 인덱스의 사진을 목록에서 제거합니다.
   * @param index - 제거할 사진 인덱스
   */
  function removeAt(index: number) {
    onChange(photos.filter((_, i) => i !== index))
  }

  return (
    <div className="photo-multi">
      <button
        type="button"
        className="photo-add"
        onClick={() => inputRef.current?.click()}
        disabled={working || photos.length >= max}
      >
        <Camera size={24} />
        <strong>{working ? '이미지 처리 중…' : '클릭하여 사진 업로드'}</strong>
        <span>또는 파일을 드래그 하세요</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => handleFiles(event.target.files)}
      />

      {photos.length > 0 && (
        <ul className="photo-thumbs">
          {photos.map((photo, index) => (
            <li key={`${photo.name}-${index}`} className="photo-thumb">
              <img src={photo.dataUrl} alt={photo.name} />
              <button type="button" aria-label="삭제" onClick={() => removeAt(index)}>
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="photo-hint">최대 {max}장까지 업로드 가능합니다. (JPG, PNG, HEIC → 자동 축소)</p>
    </div>
  )
}
