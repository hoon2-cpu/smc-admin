import { useRef } from 'react'
import { Camera, X } from 'lucide-react'
import './PhotoUploadMulti.css'

/** {@link PhotoUploadMulti} 컴포넌트 props. */
interface PhotoUploadMultiProps {
  /** 현재 첨부된 사진 파일명 목록. */
  photos: string[]
  /** 목록 변경 콜백. */
  onChange: (photos: string[]) => void
  /** 최대 첨부 장수. */
  max: number
}

/**
 * 다중 사진 업로드 영역. (이미지 ③ '사진 업로드')
 * 실제 파일 업로드(스토리지 전송)는 백엔드 연동 단계에서 처리하며,
 * 지금은 선택한 파일명을 목록으로 관리하고 썸네일 자리표시를 보여줍니다.
 *
 * @param props - {@link PhotoUploadMultiProps}
 * @returns 사진 업로드 엘리먼트
 */
export default function PhotoUploadMulti({ photos, onChange, max }: PhotoUploadMultiProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * 파일 선택 시 파일명을 목록에 추가합니다. (max 초과분은 잘라냄)
   * @param fileList - input이 선택한 파일 목록
   */
  function handleFiles(fileList: FileList | null) {
    if (!fileList) return
    const names = Array.from(fileList).map((file) => file.name)
    onChange([...photos, ...names].slice(0, max))
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
      <button type="button" className="photo-add" onClick={() => inputRef.current?.click()}>
        <Camera size={24} />
        <strong>클릭하여 사진 업로드</strong>
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
          {photos.map((name, index) => (
            <li key={`${name}-${index}`} className="photo-thumb">
              <span className="photo-name">{name}</span>
              <button type="button" aria-label="삭제" onClick={() => removeAt(index)}>
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="photo-hint">최대 {max}장까지 업로드 가능합니다. (JPG, PNG, HEIC)</p>
    </div>
  )
}
