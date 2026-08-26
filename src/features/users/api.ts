import { getFromGas, submitToGas, type GasResult } from '@/lib/gasClient'
import type { UserRow, UserFormValues } from './types'

/** GAS `?action=users` 응답 형식. */
interface UsersResponse {
  ok?: boolean
  users?: UserRow[]
}

/**
 * 사용자 목록을 조회합니다.
 * @returns 사용자 배열, 실패/mock/미배포 시 null
 */
export async function fetchUsers(): Promise<UserRow[] | null> {
  try {
    const json = (await getFromGas({ action: 'users' })) as UsersResponse | null
    if (json && json.ok && Array.isArray(json.users)) return json.users
    return null
  } catch (error) {
    console.error('[사용자 목록 조회 실패]', error)
    return null
  }
}

/**
 * 사용자를 등록합니다.
 * @param values - 사용자 폼 값
 * @returns 서버 응답
 */
export function registerUser(values: UserFormValues): Promise<GasResult> {
  return submitToGas('userRegister', values)
}

/**
 * 사용자 정보를 수정합니다.
 * @param values - 사용자 폼 값(사번으로 대상 식별)
 * @returns 서버 응답
 */
export function updateUser(values: UserFormValues): Promise<GasResult> {
  return submitToGas('userUpdate', values)
}
