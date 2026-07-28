// ===== 백엔드 연동 설정 =====
// 서버 작업(구글시트 저장 / Slack 알림 / 메일 자동회신)은 Google Apps Script
// 웹앱이 담당합니다. 배포 후 발급되는 웹앱 URL을 아래에 붙여넣으세요.
//
// - Slack Webhook URL, Gmail 발송은 Apps Script(Code.gs) 안에서 설정합니다.
//   (프론트엔드에는 Slack/메일 키가 노출되지 않도록 서버 측에서만 처리)

/**
 * Google Apps Script 웹앱 배포 URL.
 * '#'(기본값)이면 실제 통신 대신 mock 모드로 동작합니다(콘솔 출력).
 * 예: 'https://script.google.com/macros/s/AKfyc.../exec'
 */
// `: string` 명시 이유: 값을 리터럴 타입으로 좁히지 않아야
// gasClient의 `GAS_URL === '#'`(mock 판별) 비교가 타입 에러 없이 동작합니다.
export const GAS_URL: string =
  'https://script.google.com/macros/s/AKfycbyTgr3EzXk-TZ32NgRLYT72j48AMgRZq7JeJBUgeJFebJ9uha0urxvzDW9S0nwLMPYGhA/exec'

/**
 * 프론트엔드 → GAS 요청 검증용 공유 토큰. `.env`의 VITE_API_TOKEN에서 주입됩니다.
 *
 * 정적 사이트 특성상 빌드 결과에 포함되어 완전한 비밀은 아니지만,
 * URL만 아는 무단 요청을 1차로 차단하고 토큰 교체로 무효화할 수 있습니다.
 * Apps Script(Code.gs)의 `API_TOKEN`과 동일해야 요청이 허용됩니다.
 */
export const API_TOKEN: string = import.meta.env.VITE_API_TOKEN ?? ''
