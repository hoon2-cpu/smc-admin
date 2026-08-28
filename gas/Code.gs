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
 * 요청 검증용 공유 토큰.
 * 코드에 직접 쓰지 않고 **스크립트 속성(Script Properties)** 에서 읽습니다.
 * → 코드를 다시 붙여넣어도 토큰이 사라지지 않습니다(반복되던 문제 해결).
 *
 * 설정(최초 1회): [프로젝트 설정] → [스크립트 속성] → 속성 추가
 *   속성: API_TOKEN / 값: 프론트엔드 .env의 VITE_API_TOKEN과 동일 값
 * 비워두면 토큰 검증을 건너뜁니다(모든 요청 허용).
 */
var API_TOKEN = PropertiesService.getScriptProperties().getProperty('API_TOKEN') || ''

/** Slack Incoming Webhook URL. 비우면 Slack 알림을 건너뜁니다. */
var SLACK_WEBHOOK_URL = ''

/** 시트 탭 이름. */
var SHEET_REPAIR = '1_수리접수기록'
var SHEET_ASSET = '2_자산등록기록'
var SHEET_LOG = '3_변경로그'
var SHEET_USER = '5_사용자목록'
var SHEET_REQUEST = '6_신청기록'
var SHEET_CONSUMABLE = '7_소모품목록' // 열: 소모품명 / 현재고 / 적정재고 / 단위 (IT 소모품)

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
    if (type === 'assetUpdate') return jsonOutput_(handleAssetUpdate_(payload))
    if (type === 'repairRequest') return jsonOutput_(handleRepairRequest_(payload))
    if (type === 'repairUpdate') return jsonOutput_(handleRepairUpdate_(payload))
    if (type === 'repairDispatch') return jsonOutput_(handleRepairDispatch_(payload))
    if (type === 'userRegister') return jsonOutput_(handleUserRegister_(payload))
    if (type === 'userUpdate') return jsonOutput_(handleUserUpdate_(payload))
    if (type === 'assetRequest') return jsonOutput_(handleAssetRequest_(payload))
    if (type === 'returnRequest') return jsonOutput_(handleReturnRequest_(payload))
    if (type === 'consumableRequest') return jsonOutput_(handleConsumableRequest_(payload))
    return jsonOutput_({ ok: false, message: '알 수 없는 요청 유형: ' + type })
  } catch (err) {
    return jsonOutput_({ ok: false, message: String(err) })
  }
}

/**
 * GET 핸들러. `?action=dashboard`면 대시보드 집계를, 아니면 헬스체크를 반환합니다.
 * @param {GoogleAppsScript.Events.DoGet} e - 요청 이벤트
 * @return {GoogleAppsScript.Content.TextOutput} JSON 응답
 */
function doGet(e) {
  var params = (e && e.parameter) || {}

  if (params.action === 'dashboard') {
    // 대시보드 조회에도 동일 토큰 검증 적용
    if (API_TOKEN && params.token !== API_TOKEN) {
      return jsonOutput_({ ok: false, message: '인증 실패(토큰 불일치)' })
    }
    return jsonOutput_({ ok: true, dashboard: buildDashboard_() })
  }

  if (params.action === 'assets') {
    if (API_TOKEN && params.token !== API_TOKEN) {
      return jsonOutput_({ ok: false, message: '인증 실패(토큰 불일치)' })
    }
    return jsonOutput_({ ok: true, assets: buildAssets_() })
  }

  if (params.action === 'repairs') {
    if (API_TOKEN && params.token !== API_TOKEN) {
      return jsonOutput_({ ok: false, message: '인증 실패(토큰 불일치)' })
    }
    return jsonOutput_({ ok: true, repairs: buildRepairs_() })
  }

  if (params.action === 'users') {
    if (API_TOKEN && params.token !== API_TOKEN) {
      return jsonOutput_({ ok: false, message: '인증 실패(토큰 불일치)' })
    }
    return jsonOutput_({ ok: true, users: buildUsers_() })
  }

  if (params.action === 'vendorRepairs') {
    if (API_TOKEN && params.token !== API_TOKEN) {
      return jsonOutput_({ ok: false, message: '인증 실패(토큰 불일치)' })
    }
    // 외부업체는 '전달된' 수리 건만 조회 가능
    return jsonOutput_({ ok: true, repairs: buildRepairs_().filter(function (r) { return r.dispatched }) })
  }

  return jsonOutput_({
    ok: true,
    message: 'IT 자산관리 백엔드 정상 동작 중',
    version: 'v13-consumable',
    tokenEnabled: !!API_TOKEN,
  })
}

/**
 * 사용자목록 시트를 목록(UserRow[])으로 변환합니다.
 * 열: 0사번 1이름 2부서 3직급 4이메일
 * @return {Object[]} 사용자 목록
 */
function buildUsers_() {
  var rows = getSheet_(SHEET_USER).getDataRange().getValues()
  var out = []
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i]
    if (!r[0] && !r[1]) continue
    out.push({
      id: String(r[0] || ''),
      name: r[1] || '',
      department: r[2] || '',
      position: r[3] || '',
      email: r[4] || '',
    })
  }
  return out
}

/**
 * 사용자를 시트에 추가합니다. (사번 중복 시 거부)
 * @param {Object} p - { id, name, department, position, email }
 * @return {Object} 처리 결과
 */
function handleUserRegister_(p) {
  var sheet = getSheet_(SHEET_USER)
  var values = sheet.getDataRange().getValues()
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(p.id) && p.id) {
      return { ok: false, message: '이미 존재하는 사번입니다: ' + p.id }
    }
  }
  appendRow_(SHEET_USER, [p.id, p.name, p.department, p.position, p.email])
  return { ok: true }
}

/**
 * 사용자 정보를 수정합니다. (사번으로 행을 찾아 이름/부서/직급/이메일 갱신)
 * @param {Object} p - { id, name, department, position, email }
 * @return {Object} 처리 결과
 */
function handleUserUpdate_(p) {
  var sheet = getSheet_(SHEET_USER)
  var values = sheet.getDataRange().getValues()
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) !== String(p.id)) continue
    var row = i + 1
    sheet.getRange(row, 2).setValue(p.name || '') //       1 이름
    sheet.getRange(row, 3).setValue(p.department || '') // 2 부서
    sheet.getRange(row, 4).setValue(p.position || '') //   3 직급
    sheet.getRange(row, 5).setValue(p.email || '') //      4 이메일
    return { ok: true }
  }
  return { ok: false, message: '사번을 찾을 수 없습니다: ' + p.id }
}

/**
 * 자산 신청(직원)을 신청기록 시트에 저장합니다.
 * 열: 신청일시 / 종류 / 신청자 / 부서 / 자산번호 / 자산명(대상) / 사유 / 상세 / 상태
 * @param {Object} p - { requester, department, category, spec, reason, wantDate }
 * @return {Object} 처리 결과
 */
function handleAssetRequest_(p) {
  var now = new Date()
  var detail = p.spec || ''
  if (p.wantDate) detail += (detail ? ' / ' : '') + '희망일 ' + p.wantDate
  appendRow_(SHEET_REQUEST, [
    now,
    '자산신청',
    p.requester,
    p.department,
    '',
    p.category,
    p.reason,
    detail,
    '접수',
  ])
  notifySlack_('📝 *자산 신청* ' + (p.requester || '') + ' / ' + (p.category || ''))
  return { ok: true }
}

/**
 * 반납 신청(직원)을 신청기록 시트에 저장합니다.
 * @param {Object} p - { requester, department, assetNumber, assetName, reason, note }
 * @return {Object} 처리 결과
 */
function handleReturnRequest_(p) {
  var now = new Date()
  appendRow_(SHEET_REQUEST, [
    now,
    '반납신청',
    p.requester,
    p.department,
    p.assetNumber,
    p.assetName,
    p.reason,
    p.note,
    '접수',
  ])
  notifySlack_('📦 *반납 신청* ' + (p.requester || '') + ' / ' + (p.assetNumber || ''))
  return { ok: true }
}

/**
 * 소모품 신청(직원)을 신청기록 시트에 저장합니다.
 * 열: 신청일시 / 종류 / 신청자 / 부서 / (자산번호=빈칸) / 소모품명 / 사유 / 수량 / 상태
 * @param {Object} p - { requester, department, item, qty, reason }
 * @return {Object} 처리 결과
 */
function handleConsumableRequest_(p) {
  var now = new Date()
  appendRow_(SHEET_REQUEST, [
    now,
    '소모품신청',
    p.requester,
    p.department,
    '',
    p.item,
    p.reason,
    '수량 ' + (p.qty || ''),
    '접수',
  ])
  notifySlack_('🧴 *소모품 신청* ' + (p.requester || '') + ' / ' + (p.item || '') + ' ' + (p.qty || ''))
  return { ok: true }
}

/**
 * 수리접수 시트를 목록(RepairRow[])으로 변환합니다. (최신 접수 먼저)
 * 열: 0접수일시 1접수번호 2접수자 3부서 4자산번호 5자산명 6증상 7우선순위 8첨부 9상태 10담당자 11완료일
 * @return {Object[]} 수리 접수 목록
 */
function buildRepairs_() {
  var rows = getSheet_(SHEET_REPAIR).getDataRange().getValues()
  var out = []
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i]
    if (!r[1] && !r[6]) continue
    out.push({
      ticketNumber: r[1] || '',
      receivedAt: formatDateCell_(r[0]),
      requester: r[2] || '',
      department: r[3] || '',
      assetNumber: r[4] || '',
      assetName: r[5] || '',
      symptom: r[6] || '',
      priority: r[7] || '보통',
      status: r[9] || '접수',
      assignee: r[10] || '',
      dispatched: !!r[12], // 12: 외부업체 전달 여부(총무팀만 설정)
      attachments: r[8] || '', // 8: 첨부 사진 파일명(쉼표 구분)
    })
  }
  return out.reverse()
}

/**
 * 자산등록 시트를 자산 목록(AssetRow[])으로 변환합니다. (최신 등록 먼저)
 * @return {Object[]} 자산 목록
 */
function buildAssets_() {
  var rows = getSheet_(SHEET_ASSET).getDataRange().getValues()
  var out = []
  // 열: 0등록일시 1자산번호 2자산명 3구분 4제조사 5모델 6시리얼 7취득일 8금액
  //     9사용자 10위치 11상태 12비고 13관리번호 14키값 15취득구분 16렌탈사
  //     17부서 18구매처 19보증 20관리담당자 21폐기일
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i]
    if (!r[1] && !r[2]) continue
    out.push({
      assetNumber: r[1] || '',
      name: r[2] || '',
      category: r[3] || '기타',
      manufacturer: r[4] || '',
      model: r[5] || '',
      serialNumber: r[6] || '',
      acquiredDate: formatDateCell_(r[7]),
      purchaseAmount: r[8] === '' || r[8] == null ? '' : String(r[8]),
      user: r[9] || '',
      location: r[10] || '',
      status: r[11] || '사용중',
      note: r[12] || '',
      managementNumber: r[13] || '',
      keyValue: r[14] || '',
      acquisitionType: r[15] || '구매',
      rentalCompany: r[16] || '',
      department: r[17] || '',
      vendor: r[18] || '',
      warrantyUntil: formatDateCell_(r[19]),
      manager: r[20] || '',
      disposalDate: formatDateCell_(r[21]),
    })
  }
  return out.reverse()
}

/**
 * 자산등록 시트를 집계해 대시보드 데이터를 만듭니다.
 * (신청현황/소모품/폐기 예정은 별도 시트가 생기기 전까지 빈 배열 → 프론트가 mock으로 채움)
 * @return {Object} 대시보드 데이터
 */
function buildDashboard_() {
  var rows = getSheet_(SHEET_ASSET).getDataRange().getValues()
  var categoryMap = {}
  var stats = { totalAssets: 0, inUseAssets: 0, repairingAssets: 0, disposalPlannedAssets: 0, lowStockCount: 0 }
  var acquisition = { purchase: 0, rental: 0 }
  var rentalMap = {}
  var recent = []

  // 열: 0등록일시 1자산번호 2자산명 3구분 ... 9사용자 10위치 11상태 ... 15취득구분 16렌탈사
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i]
    if (!r[1] && !r[2]) continue // 빈 행 스킵
    stats.totalAssets++
    var category = r[3] || '기타'
    categoryMap[category] = (categoryMap[category] || 0) + 1
    var status = r[11]
    if (status === '사용중') stats.inUseAssets++
    else if (status === '수리중') stats.repairingAssets++
    else if (status === '폐기예정') stats.disposalPlannedAssets++

    // 취득 구분(구매/렌탈) + 렌탈사 집계
    if (r[15] === '렌탈') {
      acquisition.rental++
      var company = r[16] || '기타'
      rentalMap[company] = (rentalMap[company] || 0) + 1
    } else {
      acquisition.purchase++
    }

    recent.push({
      assetNumber: r[1],
      name: r[2],
      category: category,
      acquiredDate: formatDateCell_(r[7]),
      user: r[9] || '-',
      status: status || '사용중',
    })
  }

  var categories = []
  for (var key in categoryMap) categories.push({ category: key, count: categoryMap[key] })
  var rentalByCompany = []
  for (var c in rentalMap) rentalByCompany.push({ company: c, count: rentalMap[c] })

  // 소모품 재고 부족(7_소모품목록: 0소모품명 1현재고 2적정재고 3단위) — 현재고 < 적정재고
  var lowStock = []
  var crows = getSheet_(SHEET_CONSUMABLE).getDataRange().getValues()
  for (var j = 1; j < crows.length; j++) {
    var cr = crows[j]
    if (!cr[0]) continue
    var cur = Number(cr[1]) || 0
    var th = Number(cr[2]) || 0
    if (cur < th) lowStock.push({ name: cr[0], currentStock: cur, threshold: th, unit: cr[3] || '개' })
  }
  stats.lowStockCount = lowStock.length

  return {
    stats: stats,
    categories: categories,
    acquisition: acquisition,
    rentalByCompany: rentalByCompany,
    recentAssets: recent.slice(-5).reverse(), // 최근 5건
    requests: [],
    lowStock: lowStock,
    disposals: [],
  }
}

/**
 * 날짜 셀을 'YYYY-MM-DD' 문자열로 변환합니다.
 * @param {*} value - 셀 값 (Date 또는 문자열)
 * @return {string} 날짜 문자열
 */
function formatDateCell_(value) {
  // instanceof Date가 실행 컨텍스트에 따라 실패할 수 있어 getTime 유무로 판정.
  if (value && typeof value.getTime === 'function') {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd')
  }
  return value ? String(value).slice(0, 10) : ''
}

// ===== 요청 처리 =====

/**
 * 자산 등록 데이터를 시트에 저장하고 Slack 알림을 보냅니다.
 * 내부 자산번호를 자동 부여하고, 구매/렌탈 관련 필드까지 함께 적재합니다.
 * @param {Object} p - 자산 등록 폼 값
 * @return {Object} 처리 결과 (부여된 자산번호 포함)
 */
function handleAssetRegister_(p) {
  var now = new Date()
  var assetNumber = generateAssetNumber_()
  appendRow_(SHEET_ASSET, [
    now, //                0 등록일시
    assetNumber, //        1 자산번호(내부 자동 부여)
    p.name, //             2 자산명
    p.category, //         3 구분
    p.manufacturer, //     4 제조사
    p.model, //            5 모델명
    p.serialNumber, //     6 시리얼
    p.purchaseDate, //     7 취득일(구매일/렌탈시작일)
    p.purchaseAmount, //   8 구매금액
    p.user, //             9 사용자
    p.location, //         10 위치
    p.status, //           11 상태
    p.note, //             12 비고
    p.managementNumber, // 13 관리번호(업체 부여)
    p.keyValue, //         14 키값
    p.acquisitionType, //  15 취득구분(구매/렌탈)
    p.rentalCompany, //    16 렌탈사
    p.department, //       17 부서
    p.vendor, //           18 구매처
    p.warrantyUntil, //    19 보증기간
    p.manager, //          20 관리담당자
    '', //                 21 폐기일(등록 시 공란)
  ])

  notifySlack_('🖥️ *새 자산 등록* ' + assetNumber + '\n' + p.name + ' / ' + p.manufacturer + ' / ' + p.category)
  return { ok: true, assetNumber: assetNumber }
}

/**
 * 기존 자산의 운영 정보를 수정합니다. (자산번호로 행을 찾아 셀 갱신)
 * 상태가 바뀌면 변경로그(3_변경로그)에 기록해 추적성을 확보합니다.
 * @param {Object} p - { assetNumber, user, department, location, status, manager, note, disposalDate }
 * @return {Object} 처리 결과
 */
function handleAssetUpdate_(p) {
  var sheet = getSheet_(SHEET_ASSET)
  var values = sheet.getDataRange().getValues()
  for (var i = 1; i < values.length; i++) {
    if (values[i][1] !== p.assetNumber) continue
    var row = i + 1 // 시트는 1-based
    var beforeStatus = values[i][11]

    // 편집 가능한 셀만 갱신 (열 index + 1 = 1-based 위치)
    sheet.getRange(row, 10).setValue(p.user || '') //        9 사용자
    sheet.getRange(row, 11).setValue(p.location || '') //    10 위치
    sheet.getRange(row, 12).setValue(p.status || '') //      11 상태
    sheet.getRange(row, 13).setValue(p.note || '') //        12 비고
    sheet.getRange(row, 18).setValue(p.department || '') //  17 부서
    sheet.getRange(row, 21).setValue(p.manager || '') //     20 관리담당자
    sheet.getRange(row, 22).setValue(p.disposalDate || '') //21 폐기일

    if (beforeStatus !== p.status) {
      appendRow_(SHEET_LOG, [
        new Date(),
        '자산변경',
        p.manager || '',
        p.assetNumber,
        '상태',
        beforeStatus,
        p.status,
        '',
      ])
    }
    return { ok: true }
  }
  return { ok: false, message: '자산번호를 찾을 수 없습니다: ' + p.assetNumber }
}

/**
 * 내부 자산번호를 생성합니다. 형식: `AST-YYYY-####` (시트 누적 순번).
 * @return {string} 자산번호
 */
function generateAssetNumber_() {
  var sheet = getSheet_(SHEET_ASSET)
  var rowCount = sheet.getDataRange().getValues().length // 헤더 포함
  var seq = ('000' + Math.max(1, rowCount)).slice(-4)
  var year = new Date().getFullYear()
  return 'AST-' + year + '-' + seq
}

/**
 * 수리 접수의 진행 상태/담당자를 수정합니다. (접수번호로 행을 찾아 갱신)
 * 상태가 '완료'로 바뀌면 처리완료일을 오늘로 기록하고, 상태 변경은 변경로그에 남깁니다.
 * @param {Object} p - { ticketNumber, status, assignee }
 * @return {Object} 처리 결과
 */
function handleRepairUpdate_(p) {
  var sheet = getSheet_(SHEET_REPAIR)
  var values = sheet.getDataRange().getValues()
  for (var i = 1; i < values.length; i++) {
    if (values[i][1] !== p.ticketNumber) continue
    var row = i + 1
    var beforeStatus = values[i][9] // 진행상태 (col9)

    sheet.getRange(row, 10).setValue(p.status || '') //   9 진행상태
    sheet.getRange(row, 11).setValue(p.assignee || '') // 10 담당자
    if (p.status === '완료') {
      sheet.getRange(row, 12).setValue(new Date()) //     11 처리완료일
    }

    if (beforeStatus !== p.status) {
      appendRow_(SHEET_LOG, [
        new Date(),
        '수리접수',
        p.assignee || '',
        p.ticketNumber,
        '진행상태',
        beforeStatus,
        p.status,
        '',
      ])
    }
    return { ok: true }
  }
  return { ok: false, message: '접수번호를 찾을 수 없습니다: ' + p.ticketNumber }
}

/**
 * 수리 건을 외부 수리업체로 '전달' 표시합니다. (총무팀만 호출)
 * 자체 해결이 안 되는 건만 총무팀이 선택해 전달하며, /vendor는 전달된 건만 봅니다.
 * @param {Object} p - { ticketNumber }
 * @return {Object} 처리 결과
 */
function handleRepairDispatch_(p) {
  var sheet = getSheet_(SHEET_REPAIR)
  var values = sheet.getDataRange().getValues()
  for (var i = 1; i < values.length; i++) {
    if (values[i][1] !== p.ticketNumber) continue
    var row = i + 1
    sheet.getRange(row, 13).setValue('Y') // 13번째 열(0-based 12): 외부전달
    appendRow_(SHEET_LOG, [
      new Date(),
      '수리접수',
      '총무팀',
      p.ticketNumber,
      '외부업체 전달',
      '',
      'Y',
      '',
    ])
    return { ok: true }
  }
  return { ok: false, message: '접수번호를 찾을 수 없습니다: ' + p.ticketNumber }
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
