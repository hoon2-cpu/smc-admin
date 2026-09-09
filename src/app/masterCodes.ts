import { DEFAULT_MASTER_CODES, type MasterCodes } from '@/config/masterDefaults'
import { getFromGas, isMockMode, submitToGas, type GasResult } from '@/lib/gasClient'

/**
 * 코드(Master) 저장소. 자산구분/렌탈사/소모품/제조사 선택지를 **서버(시트 `9_코드마스터`)** 에
 * 저장하고 localStorage에 캐시합니다. 변경 이벤트로 폼 셀렉트가 즉시 반영됩니다.
 * ([[orgSettings]]와 동일 패턴 — 여러 기기/사용자 공유)
 */

const STORAGE_KEY = 'smc.master.codes'

/** 코드 변경 알림 이벤트명. */
export const MASTER_CODES_EVENT = 'smc:master-codes'

/**
 * 저장된 코드를 읽습니다. 누락 키는 기본값으로 채웁니다.(구버전 캐시 대비)
 * @returns 코드 묶음
 */
export function readMasterCodes(): MasterCodes {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_MASTER_CODES
    const parsed = JSON.parse(raw) as Partial<MasterCodes>
    return { ...DEFAULT_MASTER_CODES, ...parsed }
  } catch {
    return DEFAULT_MASTER_CODES
  }
}

/** 코드를 localStorage에 저장하고 변경 이벤트를 발행합니다. */
export function writeMasterCodes(codes: MasterCodes): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes))
  } catch {
    // 저장 실패는 무시(이벤트만 발행)
  }
  window.dispatchEvent(new Event(MASTER_CODES_EVENT))
}

// ===== 서버(시트) 동기화 =====

/** GAS `?action=masterCodes` 응답 형식. */
interface MasterCodesResponse {
  ok?: boolean
  codes?: Partial<MasterCodes> | null
}

let pullInflight: Promise<boolean> | null = null
let pulledOnce = false

/**
 * 서버(시트)에서 코드를 한 번 불러와 localStorage 캐시에 반영합니다.(요청 1회만 공유)
 * @returns 서버 데이터로 갱신했으면 true
 */
export function pullMasterFromServer(): Promise<boolean> {
  if (isMockMode() || pulledOnce) return Promise.resolve(false)
  if (pullInflight) return pullInflight
  pullInflight = (async () => {
    try {
      const json = (await getFromGas({ action: 'masterCodes' })) as MasterCodesResponse | null
      pulledOnce = true
      if (json && json.ok && json.codes) {
        writeMasterCodes({ ...DEFAULT_MASTER_CODES, ...json.codes })
        return true
      }
      return false
    } catch {
      pulledOnce = true
      return false
    } finally {
      pullInflight = null
    }
  })()
  return pullInflight
}

/**
 * 코드를 서버(시트)에 저장합니다.
 * @param codes - 저장할 코드 묶음
 * @returns 서버 응답 (mock 모드면 로컬만 사용하고 ok)
 */
export function pushMasterToServer(codes: MasterCodes): Promise<GasResult> {
  if (isMockMode()) return Promise.resolve({ ok: true })
  return submitToGas('masterCodesUpdate', codes)
}
