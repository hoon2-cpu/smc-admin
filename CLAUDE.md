# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 따라야 할 규칙과 프로젝트 정보를 정리한 문서입니다.

## 프로젝트 개요

**The SMC Admin Platform** — The SMC 총무 업무를 위한 **모듈(Module) 기반 통합 관리 플랫폼**.
(기존 "IT 자산관리 시스템"을 폐기하지 않고 확장 가능한 플랫폼으로 리팩터링 중)

- 하나의 웹사이트, 내부는 **Feature(Module) 단위로 완전 분리** (`features/<module>`)
- **모듈 레지스트리**(`src/app/registry.ts`)에 등록하면 사이드바 메뉴 + 라우트가 **자동 생성** (확장 지점)
- 현재 모듈: Dashboard / 구매·정산(purchase) / 자산(asset) / 소모품(consumable) / 수리(repair) / 코드-Master / 사용자(users) / 설정(settings)
- 향후: 차량 / 계약 / 회의실 / 방문객 / 예산 관리
- 🗄️ **DB**: Google Sheets · **API**: Google Apps Script(REST 역할, 화면 없음) · 파일: Google Drive
- 배포: 한 사이트(GitHub Pages), `BrowserRouter`로 `/admin/*` 경로 분리 (`#` 없음)

## 🧭 핵심 아키텍처 원칙 (최우선 · 모든 데이터 설계의 기준)

이 프로젝트는 **'월마감 자동화 시스템'이 아니다.**
**'구매 데이터를 중심으로 총무 업무를 관리하는 플랫폼'**이다.

- **Purchase DB = Single Source of Truth(SSOT)**. 모든 기능은 Purchase DB를 **참조**한다.
- **월마감(Closing)은 하나의 Module**일 뿐이고, **정산은 하나의 Output(Export)**일 뿐이다.
- Import / Export / Dashboard / Asset / Closing / Statistics 는 서로 **느슨하게 결합(Loose Coupling)**된다.
  - 모듈은 서로의 DB에 직접 쓰지 않는다. **Purchase DB를 정해진 읽기 계약으로 참조**하고, 자산 등 이관은 **단방향**으로 넘긴다.
- **변경 격리(Adaptation Layer)**: 회사 업무 프로세스·재무 양식이 바뀌어도
  **DB 구조는 유지**하고 **Import · Export · Rule · Template만 수정**해서 대응한다.
  → 변동성이 큰 부분(입력 매핑/출력 양식/규칙)을 DB 스키마와 분리해 격리한다.

> 🅿️ **현재 상태(사용자 결정, 2026-08 기준): 구매·정산 모듈은 보류.**
> 지금은 **기존 자산관리 시스템 완성도**에 집중한다. 아래 SSOT 원칙·도메인 문서는 **재개 시** 적용하며,
> 재개 결정 전에는 **6~11단계(Master/Purchase/API/DB)를 진행하지 않는다.** (구매 업무 파악이 아직 진행 중)
> 1~4단계(모듈 플랫폼 틀)는 유지 — 자산 시스템은 이 구조 안에서 정상 동작한다.
>
> 📎 재개용 참고: [docs/PURCHASE_DOMAIN.md](docs/PURCHASE_DOMAIN.md) (구매·정산 도메인 지식)

## 기술 스택

- **React 18 + TypeScript + Vite**
- 라우팅: `react-router-dom` (BrowserRouter, `/admin/*`) — GitHub Pages 새로고침은 빌드시 생성되는 `dist/404.html` SPA 폴백으로 대응
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
├─ app/          플랫폼 코어
│  ├─ types.ts       ModuleDef 타입
│  ├─ registry.ts    MODULES 배열 (모듈 등록 = 메뉴·라우트 자동 생성)
│  └─ router.tsx     MODULES → /admin/<path> 라우트 자동 생성
├─ types/        도메인 타입 (Asset, RepairTicket, ChangeLog, AppUser, Consumable)
├─ constants/    선택 옵션·enum — as const 파생
├─ config/       백엔드 연동 설정 (GAS URL, API 토큰)
├─ lib/          순수 유틸/클라이언트 (gasClient 등, + *.test.ts)
├─ hooks/        공통 커스텀 훅 (useForm 등)
├─ components/
│  ├─ ui/        표현용 순수 UI (Card, Badge, StatCard, + 예정: Button/Table/Modal/Breadcrumb)
│  ├─ form/      재사용 폼 (FormSection, FormField, TextInput, SelectField)
│  ├─ layout/    AdminLayout · ModuleSidebar · TopBar (공통 레이아웃)
│  └─ feedback/  안내 (ComingSoon)
└─ features/     모듈별 폴더 (한 모듈 = 한 폴더, index.ts에서 ModuleDef export)
   ├─ dashboard/  asset/  repair/          (구현됨)
   └─ purchase/  consumable/  master/  users/  settings/   (뼈대·ComingSoon)
```

> ✅ **미사용 레이아웃 정리 완료**: 피벗 잔재(AppShell·AdminSidebar·sidebarConfig·Employee/Support 레이아웃·BottomNav·bottomTabs·features/landing) 제거됨.
> 현재 `layout/`은 `AdminLayout · ModuleSidebar · TopBar · MobileHeader`만 유지.
> (참고: `public/videos/main_video.mp4`는 랜딩 제거로 미참조 상태 — 필요 없으면 삭제 가능)

자세한 설계·데이터 모델은 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) 참고.

## 라우트 맵 (BrowserRouter)

| 경로 | 화면 |
| --- | --- |
| `/` | → `/admin/dashboard` 리다이렉트 |
| `/admin/dashboard` | 대시보드 |
| `/admin/purchase` | 구매·정산관리 (준비중) |
| `/admin/assets` | 자산관리 (기존 자산등록) |
| `/admin/consumables` | 소모품관리 (준비중) |
| `/admin/repair` | 수리관리 (기존 수리요청) |
| `/admin/master` | 코드(Master)관리 (준비중) |
| `/admin/users` | 사용자관리 (목록/등록/수정) |
| `/admin/settings` | 설정 (준비중) |

## 진행 현황 — 1차(IT 자산 시스템) 완료분

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

## 🏗️ 플랫폼 전환 (The SMC Admin Platform) — 12단계

> 각 단계는 **사용자 승인 후** 다음 단계 진행. 기존 코드 최대한 재사용, 폐기 없음.
> 🅿️ **6~11단계(구매·정산 관련)는 현재 보류.** 1~4단계 구조는 유지하고, 지금은 자산관리 완성에 집중.

- [x] **1단계** 현재 구조 분석
- [x] **2단계** 새 플랫폼 구조 설계 (모듈 레지스트리 / 단일 Layout / `/admin/*` / GAS·Sheets 분리)
  - 결정: BrowserRouter · 기존 직원/서포트 화면은 admin 모듈로 통합 · `/`→`/admin/dashboard` · 폴더명 `features/` 유지
- [x] **3단계** 폴더 구조 리팩터링 (asset-register→asset, repair-request→repair, 신규 모듈 뼈대, 모듈 레지스트리 도입)
- [x] **4단계** 라우팅 전환 (BrowserRouter + 레지스트리 자동 라우트 + AdminLayout/ModuleSidebar + 404.html + 모듈 lazy)
- [ ] **5단계** 공통 Layout 완성 ← **다음 시작점**
  - AdminLayout에 Header(Breadcrumb·검색·사용자) + Footer + 반응형(모바일 드로어)
  - 공통 컴포넌트 보강: Button / Table / Modal / Breadcrumb (Notion·Linear·Material 톤)
  - 미사용 레이아웃 파일 정리(AppShell/AdminSidebar/Employee·Support/BottomNav/landing 등)
- [ ] **6단계** 데이터 아키텍처(SSOT) + Master(코드) 구조 설계 ← **Master/Purchase 진입 전 필수 선행**
  - Purchase DB를 SSOT로 확정. Import→DB 매핑 규칙(Rule), DB→출력 템플릿(Template), 모듈 간 읽기 계약 정의
  - 변경 격리: DB 스키마 고정, 변동성은 Import/Export/Rule/Template로 흡수
- [ ] **7단계** Purchase(구매·정산) Module 설계 — **Purchase DB(SSOT) 중심**
  - 프로세스: 아마란스 구매품의 Import(엑셀) 또는 직접등록/정기지출 → 구매 → 영수증 Drive 저장 → Master 자동매핑 → **Purchase DB 적재** → (Output) 월마감 시트 해당 월 탭 작성 → 아마란스 정산품의 등록 (※ 아마란스 API 미사용, Excel Import 기반)
  - 월마감=Module, 정산=Output. 둘 다 Purchase DB를 참조하는 파생물일 뿐
- [ ] **8단계** Dashboard 개선
- [ ] **9단계** Asset Module 연계 (구매 완료 품목 중 자산 대상 → '자산 등록'으로 전달. 예: 노트북/모니터/프린터. Claude·ChatGPT·택배·렌탈료·전기/통신비 등은 구매·정산에서만 관리)
- [ ] **10단계** GAS API 설계 (Main.gs 라우터 + module/action 디스패치 → 서비스별 .gs 분리)
- [ ] **11단계** DB(Sheets) 설계 (Master들 + Purchase/Asset/Consumable/Repair/Receipt/Closing_DB) — **Purchase_DB = SSOT** 기준, 6단계 설계 확정본을 실제 시트로 구현
- [ ] **12단계** 최종 리팩터링

## ⚠️ 미해결 (다음 세션 / 비공개 배포 시 처리)

- **GAS 토큰 현재 OFF (`tokenEnabled:false`)** — 사용자 결정으로 **비공개 배포 단계에서 한 번에 처리**하기로 보류.
  켜는 법(최종): ① `gas/Code.gs` 최신본(버전 `v5-token-prop`) 재붙여넣기 → ② **[프로젝트 설정]→[스크립트 속성]** 에 `API_TOKEN` = `.env`의 `VITE_API_TOKEN` 값 추가 후 **저장** → ③ 새 버전 재배포.
  (토큰을 스크립트 속성에서 읽도록 바꿔, 이후엔 코드 재붙여넣기해도 유실 안 됨)
- 실운영 전 **토큰 재발급(rotation)** 권장 — 개발 중 값 노출됨. `.env` + 스크립트 속성 동일 새 값 → 프론트 build.
- **접근 제어 = 공용 비밀번호 게이트** 적용됨 (기본 `smc-admin-2026`, SHA-256 비교, `src/config/auth.ts`). Google OAuth는 조직 정책 이슈로 보류.
  - 한계: 클라이언트 측 게이트(데이터는 GAS 토큰으로 별도 보호). 더 강한 보호는 GAS 비밀번호/토큰 검증으로 업그레이드 가능.
- **배포 완료**: GitHub `hoon2-cpu/smc-admin` → Pages `https://hoon2-cpu.github.io/smc-admin/` (GitHub Actions 자동배포, vite base `/smc-admin/`). 공용 비밀번호 게이트로 접근 제한 중.
- **테스트 행 정리** — 시트의 `[테스트]`/`[토큰검증]`/`[연결테스트]` 및 자산 `AST-2026-0002` 등 삭제.

## 다음 진행 후보 (미완) — 현재 방향: 자산관리 시스템 완성

- [ ] **GAS 토큰 복구**(미해결, 위 참고) + 시트 테스트 행 정리
- [x] GitHub push → Pages 배포 완료 (`https://hoon2-cpu.github.io/smc-admin/`)
- [ ] 자산관리 모듈 기능 확장 (자산 이력/폐기목록 등 — 필요 시)
- [x] 사용자관리 모듈 구현 (목록/등록/수정)
- [ ] 설정/Master 등 남은 '준비중' 모듈 구현
- [ ] (선택) 공통 Layout 다듬기 (Header/Breadcrumb/Footer·반응형)
- [ ] 디자인/문구 다듬기

> 구매·정산(6~11단계)은 보류 상태. 재개하려면 [docs/PURCHASE_DOMAIN.md](docs/PURCHASE_DOMAIN.md)부터 검토.

> GAS 재배포로 URL이 바뀌면 `src/config/api.ts`의 `GAS_URL`도 갱신해야 함.
> 배포 반영 확인: 웹앱 GET → `version` 필드로 판별(`v8-repair-update`가 최신).

## 🔀 역할 기반 개편 로드맵 (진행 중)

> 사용자 요구(2026-08): **총무팀 / 일반직원 / 외부수리업체** 3개 역할(화면)로 분리.
> 인증은 **역할별 비밀번호**로 진행(Google OAuth는 조직 정책으로 보류). 모든 화면 **모바일 반응형**.

- [x] **1) 모바일 반응형** — 관리자 레이아웃을 모바일 드로어/햄버거로 정비(1차 완료). 페이지별 추가 폴백 가능.
- [ ] **2) 역할/라우팅 분리** — `/admin`(총무팀 전체관리) · `/request`(직원 신청폼) · `/vendor`(외부업체 수리목록) + 역할별 비밀번호 게이트
- [ ] **3) 직원 신청 폼** surface — 자산신청 · 수리신청(기존 재사용) · 반납신청 (모바일 우선). 총무팀이 아닌 모든 부서 대상.
- [ ] **4) 외부업체 페이지** — 총무팀 수리 상세의 **'외부업체 전달'** 클릭 → GAS에 외부전달 표시 → `/vendor`에서 해당 건만 조회. (A/S 외부 직원 공유용)

> 총무팀 전체관리 필수 항목: 자산 접수확인 · 자산 등록 · 자산 폐기 · 재고자산 · 사용중 자산 확인.

## 데이터 & 연동 메모

- 신청/등록 폼은 GAS로 **실제 저장**됨. 관리자 대시보드는 자산 시트를 **실집계**하고, 데이터 없는 섹션(신청/소모품/폐기)은 mock으로 폴백.
- **자산관리(`/admin/assets`)는 실데이터 연동 완료** — `?action=assets` 조회(useAssets, mock 폴백), 등록 시 자산번호 자동부여(`AST-YYYY-####`), 구매/렌탈 통합(취득구분·렌탈사·관리번호·키값) + 필터 탭 + **검색/정렬** + **행 클릭 상세보기·수정·상태변경·폐기 처리(assetUpdate)**.
- **자산 라벨 인쇄** — 자산 상세 모달 '라벨 인쇄' → 새 창에 **the SMC 로고(`public/logo.png`) + QR(자산번호) + 자산번호 텍스트** 라벨(**50×30mm**) 생성 후 인쇄. `qrcode`, `features/asset/labelPrint.ts`. 로고 data URL 임베드(없으면 텍스트 폴백). 클라이언트 전용. (사용자 최종 선택: QR)
- **자산 코드 스캔 조회** — 자산 목록 '스캔'(카메라) → **Code128/QR 디코드** → 자산번호로 상세 모달 오픈. `html5-qrcode`(formatsToSupport: CODE_128+QR), `components/ui/QrScannerModal.tsx`. 카메라는 https/localhost에서만. (라벨 인쇄↔스캔 왕복 완성)
- **수리관리(`/admin/repair`)는 접수 목록 화면** — `?action=repairs` 조회(useRepairs, mock 폴백) + 요약카드, 수리 접수는 모달(기존 폼 재사용).
- **사용자관리(`/admin/users`)** — `?action=users` 조회(useUsers, mock 폴백) + `userRegister`/`userUpdate`. 사번(5_사용자목록 사번열) 기준 관리.
- **GAS 최신 버전 `v9-users`** (저장소 기준) — 자산/수리/사용자 엔드포인트 포함.
  > ⚠️ 배포된 GAS는 `v8`. **사용자 실데이터는 GAS를 v9로 재배포해야** 동작(미배포 시 mock). 재배포는 토큰 설정과 함께 진행 예정.
- Google Apps Script는 정적 호스팅(GitHub Pages)이 못 하는 서버 작업(시트 저장/Slack/메일)을 담당.
- `GAS_URL`은 `src/config/api.ts`에 설정. `.env`의 `VITE_API_TOKEN`으로 요청 검증(서버 `API_TOKEN`과 일치 필요).
- Slack Webhook URL / Gmail 발송은 `Code.gs` 내부 설정(프론트에 미노출).

## 커밋 히스토리 컨벤션 예시

```
feat: 관리자 대시보드 화면 구현 (이미지 4)
chore: TypeScript 전환 및 프로젝트 기반 세팅
fix: useForm 제네릭 제약 완화
```
