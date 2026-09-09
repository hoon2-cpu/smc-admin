import { useCallback, useEffect, useState } from 'react'
import {
  MASTER_CODES_EVENT,
  pullMasterFromServer,
  pushMasterToServer,
  readMasterCodes,
  writeMasterCodes,
} from '@/app/masterCodes'
import { DEFAULT_MASTER_CODES, type MasterCodes } from '@/config/masterDefaults'
import type { GasResult } from '@/lib/gasClient'

/** {@link useMasterCodes} 반환 형태. */
export interface UseMasterCodesReturn {
  /** 현재 코드 묶음. */
  codes: MasterCodes
  /** 코드 저장(로컬 캐시 + 서버). */
  saveCodes: (next: MasterCodes) => Promise<GasResult>
  /** 기본값으로 복원(서버 반영). */
  resetCodes: () => Promise<GasResult>
}

/**
 * 코드(Master) 훅. 마운트 시 서버에서 최신값을 1회 불러오고,
 * 저장 시 로컬 캐시 + 서버에 함께 반영합니다. 변경 이벤트로 폼 셀렉트가 동기화됩니다.
 *
 * @returns 코드 상태·조작 ({@link UseMasterCodesReturn})
 */
export function useMasterCodes(): UseMasterCodesReturn {
  const [codes, setCodesState] = useState<MasterCodes>(readMasterCodes)

  useEffect(() => {
    const sync = () => setCodesState(readMasterCodes())
    window.addEventListener(MASTER_CODES_EVENT, sync)
    window.addEventListener('storage', sync)
    void pullMasterFromServer()
    return () => {
      window.removeEventListener(MASTER_CODES_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const saveCodes = useCallback((next: MasterCodes) => {
    writeMasterCodes(next)
    return pushMasterToServer(next)
  }, [])

  const resetCodes = useCallback(() => {
    writeMasterCodes(DEFAULT_MASTER_CODES)
    return pushMasterToServer(DEFAULT_MASTER_CODES)
  }, [])

  return { codes, saveCodes, resetCodes }
}
