import type { Department } from '@/constants/organization'

/**
 * 앱 사용자 1명. 구글시트 `5_사용자목록` 시트의 한 행에 대응합니다.
 * (React의 내장 User 타입 등과 헷갈리지 않도록 AppUser로 명명)
 */
export interface AppUser {
  /** 사번 등 고유 식별자. */
  id: string
  /** 이름. */
  name: string
  /** 소속 부서. */
  department: Department
  /** 직급 (예: '차장'). */
  position: string
  /** 이메일 (신청 완료 자동회신 대상). */
  email: string
}
