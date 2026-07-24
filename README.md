# IT 자산 신청 & 관리 대시보드

회사 IT 자산의 **신청·등록·수리접수·현황 관리**를 한 곳에서 처리하는 웹 시스템입니다.

- **직원용**: 자산 등록(QR), 수리 요청 (모바일 우선)
- **관리자용**: 자산/신청/재고/폐기 현황 대시보드 (데스크톱)
- **DB**: Google Sheets (Google Apps Script 연동)

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| 프론트엔드 | React 18 + TypeScript + Vite |
| 라우팅 | react-router-dom (HashRouter) |
| 차트 | Recharts |
| 백엔드 | Google Apps Script (Sheets / Slack / Gmail) |
| 테스트 | Vitest + Testing Library |
| 품질 | ESLint + Prettier |
| 문서 | TypeDoc (JSDoc → API 문서) |
| 호스팅 | GitHub Pages (GitHub Actions 자동 배포) |

## 시작하기

```bash
npm install       # 의존성 설치
npm run dev       # 개발 서버 (http://localhost:5173)
```

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 타입 검사 후 프로덕션 빌드(`dist/`) |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint 검사 |
| `npm run format` | Prettier 포맷 정리 |
| `npm run typecheck` | 타입만 검사 |
| `npm run test` | 테스트 1회 실행 |
| `npm run test:watch` | 테스트 감시 모드 |
| `npm run docs:api` | JSDoc 기반 API 문서 생성(`docs/api/`) |

## 폴더 구조

```
src/
├─ types/        도메인 타입 (Asset, RepairTicket, ...)
├─ constants/    선택 옵션·enum (제조사/부서/상태 ...)
├─ config/       백엔드 연동 설정 (GAS URL)
├─ lib/          순수 유틸 함수 (+ *.test.ts)
├─ hooks/        공통 커스텀 훅
├─ components/   재사용 UI (ui/) · 레이아웃 (layout/) · 피드백 (feedback/)
└─ features/     기능별 폴더 (landing / dashboard / asset-register / repair-request)
```

자세한 설계는 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) 참고.

## 배포

`main` 브랜치에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가
자동으로 빌드 후 GitHub Pages에 배포합니다.
