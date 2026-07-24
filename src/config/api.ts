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
export const GAS_URL = '#'
