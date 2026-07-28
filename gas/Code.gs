/**
 * IT 자산관리 - Google Apps Script 백엔드
 * ------------------------------------------------------------
 * 역할: 프론트엔드(GitHub Pages)에서 받은 신청/등록 데이터를
 *       구글시트에 저장하고, Slack 알림 + 메일 자동회신을 보냅니다.
 *
 * 배포: [배포] > [새 배포] > 유형 '웹 앱'
 *   - 실행 계정: 나
 *   - 액세스 권한: 모든 사용자(Anyone)
 *   발급된 웹앱 URL을 프론트엔드 src/config/api.ts 의 GAS_URL 에 넣습니다.
 */

// ===== 설정 (사용 환경에 맞게 수정) =====

/**
 * 요청 검증용 공유 토큰. 프론트엔드 .env의 VITE_API_TOKEN과 동일하게 설정하세요.
 * 비워두면(''): 토큰 검증을 건너뜁니다(모든 요청 허용).
 * 값을 넣으면: 동일 토큰이 없는 요청은 거부합니다.
 */
var API_TOKEN = ''

/** Slack Incoming Webhook URL. 비우면 Slack 알림을 건너뜁니다. */
var SLACK_WEBHOOK_URL = ''

/** 시트 탭 이름. */
var SHEET_REPAIR = '1_수리접수기록'
var SHEET_ASSET = '2_자산등록기록'
var SHEET_LOG = '3_변경로그'
var SHEET_USER = '5_사용자목록'

// ===== 진입점 =====

/**
 * 프론트엔드의 POST 요청을 처리합니다.
 * @param {GoogleAppsScript.Events.DoPost} e - 요청 이벤트
 * @return {GoogleAppsScript.Content.TextOutput} JSON 응답
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents)

    // 토큰이 설정된 경우, 일치하지 않는 요청은 거부합니다(무단 쓰기 차단).
    if (API_TOKEN && body.token !== API_TOKEN) {
      return jsonOutput_({ ok: false, message: '인증 실패(토큰 불일치)' })
    }

    var type = body.type
    var payload = body.payload || {}

    if (type === 'assetRegister') return jsonOutput_(handleAssetRegister_(payload))
    if (type === 'repairRequest') return jsonOutput_(handleRepairRequest_(payload))
    return jsonOutput_({ ok: false, message: '알 수 없는 요청 유형: ' + type })
  } catch (err) {
    return jsonOutput_({ ok: false, message: String(err) })
  }
}

/**
 * 웹앱 상태 확인용 GET 핸들러.
 * 배포 반영 여부 확인을 위해 버전 태그와 토큰 활성화 상태를 함께 반환합니다.
 * @return {GoogleAppsScript.Content.TextOutput} 헬스체크 JSON
 */
function doGet() {
  return jsonOutput_({
    ok: true,
    message: 'IT 자산관리 백엔드 정상 동작 중',
    version: 'v2-token',
    tokenEnabled: !!API_TOKEN,
  })
}

// ===== 요청 처리 =====

/**
 * 자산 등록 데이터를 시트에 저장하고 Slack 알림을 보냅니다.
 * @param {Object} p - 자산 등록 폼 값
 * @return {Object} 처리 결과
 */
function handleAssetRegister_(p) {
  var now = new Date()
  appendRow_(SHEET_ASSET, [
    now,
    '', // 자산번호(운영 규칙에 따라 부여)
    p.name,
    p.category,
    p.manufacturer,
    p.model,
    p.serialNumber,
    p.purchaseDate,
    p.purchaseAmount,
    p.user,
    p.location,
    p.status,
    p.note,
  ])

  notifySlack_('🖥️ *새 자산 등록*\n' + p.name + ' / ' + p.manufacturer + ' / ' + p.category)
  return { ok: true }
}

/**
 * 수리 요청을 시트에 저장하고, 변경로그 기록 + Slack + 메일 회신을 처리합니다.
 * @param {Object} p - 수리 요청 폼 값
 * @return {Object} 처리 결과 (접수번호 포함)
 */
function handleRepairRequest_(p) {
  var now = new Date()
  var ticketNumber = generateTicketNumber_(now)

  appendRow_(SHEET_REPAIR, [
    now,
    ticketNumber,
    p.requesterName,
    p.department,
    p.assetNumber,
    p.assetName,
    p.symptom,
    p.priority,
    (p.photos || []).join(', '),
    '접수',
    '', // 담당자(배정 전)
    '', // 처리완료일
  ])

  // 모든 접수는 변경로그에 남겨 추적성을 확보합니다.
  appendRow_(SHEET_LOG, [now, '수리접수', p.requesterName, ticketNumber, '진행상태', '', '접수', '신규 접수'])

  notifySlack_('🛠️ *새 수리 접수* ' + ticketNumber + '\n' + p.assetNumber + ' - ' + p.symptom)

  // 요청자 이메일을 사용자목록에서 찾아 자동 회신(없으면 건너뜀).
  var email = lookupEmailByName_(p.requesterName)
  if (email) {
    MailApp.sendEmail(
      email,
      '[IT 자산관리] 수리 요청이 접수되었습니다 (' + ticketNumber + ')',
      '안녕하세요 ' + p.requesterName + '님,\n\n' +
        '수리 요청이 정상 접수되었습니다.\n' +
        '접수번호: ' + ticketNumber + '\n' +
        '자산: ' + p.assetNumber + ' ' + (p.assetName || '') + '\n' +
        '증상: ' + p.symptom + '\n\n' +
        '담당자가 확인 후 빠르게 연락드리겠습니다.',
    )
  }

  return { ok: true, ticketNumber: ticketNumber }
}

// ===== 헬퍼 =====

/**
 * 이름 기준 접수번호를 생성합니다. 형식: R-YYYY-MMDD-#### (당일 순번)
 * @param {Date} date - 접수 일시
 * @return {string} 접수번호
 */
function generateTicketNumber_(date) {
  var sheet = getSheet_(SHEET_REPAIR)
  var todayCount = 1
  var values = sheet.getDataRange().getValues()
  var y = date.getFullYear()
  var m = date.getMonth()
  var d = date.getDate()
  // 헤더(0행) 제외, 같은 날짜의 접수 건수를 세어 순번을 만듭니다.
  for (var i = 1; i < values.length; i++) {
    var when = values[i][0]
    if (when instanceof Date && when.getFullYear() === y && when.getMonth() === m && when.getDate() === d) {
      todayCount++
    }
  }
  var mm = ('0' + (m + 1)).slice(-2)
  var dd = ('0' + d).slice(-2)
  var seq = ('000' + todayCount).slice(-4)
  return 'R-' + y + '-' + mm + dd + '-' + seq
}

/**
 * 시트 탭을 가져옵니다. 없으면 새로 만듭니다.
 * @param {string} name - 시트 탭 이름
 * @return {GoogleAppsScript.Spreadsheet.Sheet} 시트
 */
function getSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(name)
  if (!sheet) sheet = ss.insertSheet(name)
  return sheet
}

/**
 * 시트 마지막에 행을 추가합니다.
 * @param {string} sheetName - 시트 탭 이름
 * @param {Array} row - 추가할 행 데이터
 */
function appendRow_(sheetName, row) {
  getSheet_(sheetName).appendRow(row)
}

/**
 * 사용자목록 시트에서 이름으로 이메일을 조회합니다.
 * (열 순서: 사번, 이름, 부서, 직급, 이메일)
 * @param {string} name - 조회할 이름
 * @return {string} 이메일 (없으면 빈 문자열)
 */
function lookupEmailByName_(name) {
  if (!name) return ''
  var values = getSheet_(SHEET_USER).getDataRange().getValues()
  for (var i = 1; i < values.length; i++) {
    if (values[i][1] === name) return values[i][4] || ''
  }
  return ''
}

/**
 * Slack Webhook으로 메시지를 보냅니다. (URL 미설정 시 무시)
 * @param {string} text - 보낼 메시지
 */
function notifySlack_(text) {
  if (!SLACK_WEBHOOK_URL) return
  UrlFetchApp.fetch(SLACK_WEBHOOK_URL, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ text: text }),
    muteHttpExceptions: true,
  })
}

/**
 * 객체를 JSON 텍스트 응답으로 변환합니다.
 * @param {Object} obj - 응답 객체
 * @return {GoogleAppsScript.Content.TextOutput} JSON 출력
 */
function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
