import PhotoUploadMulti from '../components/PhotoUploadMulti'
import AssetPicker from '../components/AssetPicker'
import PrioritySelect from '../components/PrioritySelect'
import { MAX_PHOTOS, SYMPTOM_MAX_LENGTH, type RepairFormControl } from '../formConfig'
import './stepBlocks.css'

/**
 * 1단계 — 증상 입력. (이미지 ③ 좌측)
 * 사진 / 증상 설명 / 자산 정보 / 긴급도를 입력받습니다.
 *
 * @param props - 폼 제어 객체 ({@link RepairFormControl})
 * @returns 증상 입력 스텝
 */
export default function SymptomStep({ values, setField }: RepairFormControl) {
  return (
    <div className="step-blocks">
      <section className="step-block">
        <h3>
          1. 사진 업로드 <span className="req">*</span>
        </h3>
        <p className="block-desc">문제가 발생한 부분을 여러 각도에서 촬영해 주세요.</p>
        <PhotoUploadMulti
          photos={values.photos}
          onChange={(photos) => setField('photos', photos)}
          max={MAX_PHOTOS}
        />
      </section>

      <section className="step-block">
        <h3>
          2. 증상 설명 <span className="req">*</span>
        </h3>
        <textarea
          className="symptom-textarea"
          maxLength={SYMPTOM_MAX_LENGTH}
          placeholder="어떤 문제가 발생하고 있나요?"
          value={values.symptom}
          onChange={(event) => setField('symptom', event.target.value)}
        />
        <div className="char-count">
          {values.symptom.length} / {SYMPTOM_MAX_LENGTH}
        </div>
      </section>

      <section className="step-block">
        <h3>3. 자산 정보</h3>
        <p className="block-desc">자산 라벨의 QR코드를 스캔하거나 자산번호를 입력하세요.</p>
        <AssetPicker
          assetNumber={values.assetNumber}
          assetName={values.assetName}
          onSelect={(assetNumber, assetName) => {
            setField('assetNumber', assetNumber)
            setField('assetName', assetName)
          }}
        />
      </section>

      <section className="step-block">
        <h3>4. 긴급도 선택</h3>
        <p className="block-desc">업무에 미치는 영향을 선택해주세요.</p>
        <PrioritySelect value={values.priority} onChange={(priority) => setField('priority', priority)} />
      </section>
    </div>
  )
}
