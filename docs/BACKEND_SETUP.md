# 백엔드 연동 세팅 가이드 (5단계)

구글시트 저장 + Slack 알림 + 메일 자동회신을 연결하는 방법입니다.
프론트엔드는 이미 준비되어 있고, 아래 **URL 하나만** 채우면 실제로 동작합니다.

> 아직 세팅 전이면 앱은 **mock 모드**로 동작합니다 (제출 시 콘솔 출력 + 성공 처리).

---

## 1. 구글시트 만들기

새 구글시트를 만들고 아래 5개 탭(시트)을 만듭니다. **1행은 헤더**입니다.

| 탭 이름 | 헤더(1행) 열 순서 |
| --- | --- |
| `1_수리접수기록` | 접수일시 / 접수번호 / 접수자 / 부서 / 자산번호 / 자산명 / 증상 / 우선순위 / 첨부파일 / 진행상태 / 담당자 / 처리완료일 |
| `2_자산등록기록` | 등록일시 / 자산번호 / 자산명 / 자산구분 / 제조사 / 모델명 / 시리얼번호 / 구매일 / 구매금액 / 사용자 / 위치 / 상태 / 비고 |
| `3_변경로그` | 변경일시 / 구분 / 변경자 / 자산·접수번호 / 변경항목 / 이전값 / 이후값 / 비고 |
| `4_자산목록` | (2_자산등록기록과 동일 또는 운영용 정리본) |
| `5_사용자목록` | 사번 / 이름 / 부서 / 직급 / 이메일 |

> ⚠️ 열 순서가 `gas/Code.gs`의 저장 순서와 맞아야 합니다. 순서를 바꾸려면 Code.gs의 `appendRow_` 부분도 함께 수정하세요.

---

## 2. Apps Script 붙여넣기

1. 구글시트 상단 메뉴 **[확장 프로그램] > [Apps Script]** 클릭
2. 기본 `Code.gs` 내용을 지우고, 이 저장소의 [`gas/Code.gs`](../gas/Code.gs) 내용을 **전체 복사해 붙여넣기**
3. 상단의 설정값 수정:
   - `SLACK_WEBHOOK_URL` — Slack 알림을 쓸 경우 입력 (3번 참고). 비워두면 알림 생략.
4. 저장(💾)

---

## 3. Slack Webhook 준비 (선택)

1. Slack → **api.slack.com/apps** → Create New App → From scratch
2. **Incoming Webhooks** 활성화 → Add New Webhook to Workspace
3. 알림 받을 채널 선택 → 발급된 `https://hooks.slack.com/services/...` URL을
   `Code.gs`의 `SLACK_WEBHOOK_URL`에 붙여넣기

---

## 4. 메일 자동회신 (자동)

- 별도 키 불필요. Apps Script의 `MailApp`이 **스크립트 소유 구글 계정**으로 발송합니다.
- 회신 대상 이메일은 `5_사용자목록`에서 **접수자 이름으로 조회**합니다.
  (이름이 목록에 없으면 메일은 생략되고 접수는 정상 처리됩니다.)
- 최초 실행 시 권한 승인(메일 발송/시트 접근) 팝업이 뜨면 허용해야 합니다.

---

## 5. 웹앱으로 배포

1. Apps Script 우상단 **[배포] > [새 배포]**
2. 유형 톱니바퀴 → **웹 앱** 선택
3. 설정:
   - 설명: 아무거나 (예: v1)
   - **실행 계정: 나**
   - **액세스 권한: 모든 사용자(Anyone)** ← 프론트엔드에서 호출하려면 필수
4. **배포** → 권한 승인 → 발급된 **웹 앱 URL** 복사
   (형식: `https://script.google.com/macros/s/AKfyc.../exec`)

---

## 6. 프론트엔드에 URL 연결

`src/config/api.ts` 파일의 `GAS_URL` 값을 복사한 URL로 교체:

```ts
export const GAS_URL = 'https://script.google.com/macros/s/AKfyc.../exec'
```

저장 후 `npm run dev`로 실제 제출 → 시트 저장/Slack/메일이 동작하는지 확인합니다.

---

## 통신 방식 메모 (개발자용)

- 프론트는 `POST { type, payload }`를 **`text/plain`** 으로 전송합니다.
  (Apps Script가 CORS 프리플라이트를 처리 못 하므로 프리플라이트가 없는 방식 사용)
- 서버는 `{ ok, ticketNumber?, message? }` JSON을 반환합니다.
- 관련 코드: 프론트 [`src/lib/gasClient.ts`](../src/lib/gasClient.ts), 서버 [`gas/Code.gs`](../gas/Code.gs)
