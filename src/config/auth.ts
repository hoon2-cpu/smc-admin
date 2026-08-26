// ===== 역할별 비밀번호 로그인 설정 =====
// 총무팀(admin) / 일반직원(employee) / 외부수리업체(vendor) 3개 역할.
// 입력한 비밀번호의 SHA-256 해시가 어느 역할과 일치하는지로 역할을 판별합니다.
// (평문은 번들에 없고 해시만 저장)
//
// 기본 비밀번호 (변경하려면 해당 역할 해시를 교체):
//   admin(총무팀)    : smc-admin-2026
//   employee(직원)   : smc-staff-2026
//   vendor(외부업체) : smc-vendor-2026
//   해시 생성: node -e "console.log(require('crypto').createHash('sha256').update('새비번').digest('hex'))"

/** 사용자 역할. */
export type Role = 'admin' | 'employee' | 'vendor'

/** 역할별 비밀번호 SHA-256 해시. */
export const ROLE_PASSWORD_SHA256: Record<Role, string> = {
  admin: '9bbdfd2fb4c8d4c945e95231895e917365e003613a886737b9fde6b04a8fb737',
  employee: 'fc5a8e3e64fecfc59c37958367be893a75196c0fe475978505c329c67fde7e10',
  vendor: 'b54c925603d959e30bed6106c2a477099b43ebf9420df95831f20187e78b4e29',
}

/** 각 역할의 진입(홈) 경로. 로그인 후·잘못된 경로 접근 시 이동합니다. */
export const ROLE_HOME: Record<Role, string> = {
  admin: '/admin/dashboard',
  employee: '/request',
  vendor: '/vendor',
}

/** 역할 라벨(표시용). */
export const ROLE_LABEL: Record<Role, string> = {
  admin: '총무팀',
  employee: '직원',
  vendor: '외부 수리업체',
}
