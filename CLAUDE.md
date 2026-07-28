# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 따라야 할 규칙과 프로젝트 정보를 정리한 문서입니다.

## 프로젝트 개요

**IT 자산 신청 & 관리 대시보드** — 회사 IT 자산의 신청·등록·수리접수·현황 관리를 한 곳에서 처리하는 웹 시스템.

- 👤 **직원용** (모바일 우선): 자산 등록(QR), 수리 요청
- 🛠️ **관리자용** (데스크톱): 자산/신청/재고/폐기 통합 대시보드
- 🗄️ **DB**: Google Sheets (Google Apps Script 연동)
- 배포: **A 방식** — 한 사이트(GitHub Pages) + 경로 분리 (`#/asset`, `#/admin`)

## 기술 스택

- **React 18 + TypeScript + Vite**
- 라우팅: `react-router-dom` (HashRouter — GitHub Pages 새로고침 404 방지)
- 차트: `recharts` / 아이콘: `lucide-react`
- 테스트: `Vitest` + `@testing-library/react`
- 품질: `ESLint` + `Prettier` / 문서: `TypeDoc`
- 백엔드: Google Apps Script (Sheets 저장 / Slack 알림 / Gmail 자동회신)

## 명령어

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 (http://localhost:5173) |
| `npm run build` | 타입 검사 후 프로덕션 빌드 |
| `npm run lint` | ESLint 검사 (경고 0 기준) |
| `npm run format` | Prettier 포맷 정리 |
| `npm run typecheck` | 타입만 검사 |
| `npm run test` | 테스트 실행 |
| `npm run docs:api` | JSDoc → API 문서 생성 (`docs/api/`) |

> Windows 환경. 새 터미널에서 `node`/`npm`/`git`이 인식 안 되면 PATH 새로고침 또는 VSCode 재시작 필요.

## 코딩 컨벤션 & 규칙 (필수 준수)

1. **TypeScript** 사용, 타입을 명확하게 작성 (strict 모드).
2. **모든 함수에 JSDoc 주석**을 단다. (`@param`, `@returns` 포함)
3. **중요한 로직에는 "왜 이렇게 구현했는지" 설명하는 주석**을 단다.
4. **컴포넌트는 하나의 역할만** 하도록 분리한다.
5. **파일당 300줄을 넘지 않게** 작성한다.
6. **중복 코드는 커스텀 훅(`hooks/`)이나 유틸 함수(`lib/`)로 분리**한다.
7. **변수명·함수명은 의미 있게** 작성한다.
8. **ESLint / Prettier 기준**에 맞게 작성한다. (커밋 전 `lint`·`format` 통과)
9. **테스트 코드**를 함께 작성한다. (로직/컴포넌트 단위)
10. **폴더 구조 일관성**을 유지한다. (아래 구조 참고)
11. **변경 사항마다 Git 커밋 메시지를 추천**한다. (`feat:`, `fix:`, `chore:` 등 컨벤셔널 커밋)

### 세부 관례

- 선택 옵션·enum은 `constants/`에 `as const` 배열로 정의하고 **유니온 타입을 파생**시킨다. (옵션 추가 시 한 곳만 수정)
- 상태값→UI 매핑 등은 `Record<Union, ...>`로 작성해 **누락을 컴파일 에러로** 잡는다.
- 경로 import는 별칭 **`@/`** (= `src/`)를 사용한다.
- CSS는 컴포넌트별 `.css` 파일로 두고, 색상·간격은 `styles/global.css`의 CSS 변수를 쓴다.
- 폼 값은 문자열로 다루고, 저장 시점에 도메인 타입으로 변환한다.

## 폴더 구조

```
src/
├─ types/        도메인 타입 (Asset, RepairTicket, ChangeLog, AppUser, Consumable)
├─ constants/    선택 옵션·enum (제조사/부서/상태/사옥 ...) — as const 파생
├─ config/       백엔드 연동 설정 (GAS URL)
├─ lib/          순수 유틸 함수 (+ *.test.ts) — 부수효과 없음
├─ hooks/        공통 커스텀 훅 (useForm 등)
├─ components/
│  ├─ ui/        표현용 순수 UI (Card, Badge, StatCard)
│  ├─ form/      재사용 폼 (FormSection, FormField, TextInput, SelectField)
│  ├─ layout/    레이아웃 (AppShell/AdminSidebar/TopBar, EmployeeLayout/MobileHeader/BottomNav)
│  └─ feedback/  안내 (ComingSoon)
└─ features/     기능별 폴더 (한 기능 = 한 폴더)
   ├─ landing/         메인 영상 랜딩
   ├─ dashboard/       관리자 대시보드 (widgets/ + mock/ + types)
   ├─ asset-register/  자산 등록 (sections/ + formConfig)
   └─ repair-request/  수리 요청 (예정)
```

자세한 설계·데이터 모델은 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) 참고.

## 라우트 맵

| 경로 | 화면 |
| --- | --- |
| `/` | 메인(영상 랜딩) |
| `/asset` → `/asset/register` | 직원용 자산 등록 (모바일) |
| `/asset/{home,list,requests,more}` | 직원용 나머지 탭 (미구현 자리표시) |
| `/admin` | 관리자 대시보드 |

## 진행 현황 (단계별)

- [x] **0단계** 기반 세팅 (TS 전환, ESLint/Prettier/Vitest/TypeDoc, 타입·상수, 문서)
- [x] **1단계** 공통 UI (Card / Badge / StatCard)
- [x] **2단계** 관리자 대시보드 (이미지 ④)
- [x] **3단계** 자산 등록 (이미지 ②, 모바일)
- [x] **4단계** 수리 요청 (이미지 ③) — 3단계 폼 + 완료화면 + AI 봇 UI
- [x] **5단계** 백엔드 연동 — GAS 웹앱 연결 완료 (GET/POST 검증됨, 시트 저장·접수번호 발급 정상)
  - 세팅 방법: [docs/BACKEND_SETUP.md](docs/BACKEND_SETUP.md)
  - `src/config/api.ts`의 `GAS_URL`에 실제 웹앱 URL 반영됨
- [x] **보안** 공유 토큰 검증 구현 — 잘못된/없는 토큰 요청 거부 확인
  - 토큰은 `.env`의 `VITE_API_TOKEN`(git 미포함) + Apps Script `Code.gs`의 `API_TOKEN`이 일치해야 통과
- [x] **자산등록 POST 검증** — 실제 저장(`2_자산등록기록`) + 대시보드 집계 반영까지 엔드투엔드 확인
- [x] **관리자 대시보드 실데이터 연동** — GAS `doGet ?action=dashboard`(v3) + `useDashboardData` 훅
  - 위젯 6종 props 기반, 실데이터 없으면/부분이면 mock 폴백 병합
  - 현재 배포: `v3-dashboard`, `GAS_URL`은 새 배포 URL로 반영됨

## ⚠️ 미해결 (다음 세션 우선 처리)

- **GAS 토큰이 현재 꺼짐(`tokenEnabled:false`)** — 코드 재붙여넣기 시 `API_TOKEN`이 `''`로 초기화됨.
  복구: Apps Script `Code.gs`의 `var API_TOKEN`에 `.env`와 동일 값 입력 → 저장 → 새 버전 재배포.
  (겸사겸사 `formatDateCell_` 날짜 포맷 수정본도 이때 함께 반영됨)
- **테스트 행 정리** — 시트의 `[테스트]`/`[토큰검증]`/`[연결테스트]` 행 삭제.
- 실운영 전 **토큰 재발급** 권장(개발 중 값 노출됨).

## 다음 진행 후보 (미완)

- [ ] GitHub 저장소 push → Pages 공개 배포
- [ ] 디자인/문구 다듬기
- [ ] (선택) 신청/소모품/폐기 전용 시트 추가 → 대시보드 나머지 섹션도 실데이터화

> GAS 재배포로 URL이 바뀌면 `src/config/api.ts`의 `GAS_URL`도 갱신해야 함.
> 배포 반영 확인: 웹앱 GET → `version` 필드로 판별(`v3-dashboard`가 최신).

## 데이터 & 연동 메모

- 신청/등록 폼은 GAS로 **실제 저장**됨. 관리자 대시보드는 자산 시트를 **실집계**하고, 데이터 없는 섹션(신청/소모품/폐기)은 mock으로 폴백.
- Google Apps Script는 정적 호스팅(GitHub Pages)이 못 하는 서버 작업(시트 저장/Slack/메일)을 담당.
- `GAS_URL`은 `src/config/api.ts`에 설정. `.env`의 `VITE_API_TOKEN`으로 요청 검증(서버 `API_TOKEN`과 일치 필요).
- Slack Webhook URL / Gmail 발송은 `Code.gs` 내부 설정(프론트에 미노출).

## 커밋 히스토리 컨벤션 예시

```
feat: 관리자 대시보드 화면 구현 (이미지 4)
chore: TypeScript 전환 및 프로젝트 기반 세팅
fix: useForm 제네릭 제약 완화
```
