# 아키텍처 문서

## 1. 전체 구조

```
[GitHub Pages: React 프론트엔드]  ──신청/등록 데이터──▶  [Google Apps Script]
                                                            ├─ 구글시트에 저장
                                                            ├─ 슬랙 알림 전송
                                                            └─ 신청자에게 메일 회신
```

GitHub Pages는 정적 호스팅만 지원하므로, 서버가 필요한 작업
(시트 저장 / 슬랙 / 메일)은 Google Apps Script 웹앱이 담당합니다.

## 2. 데이터 모델 (구글시트 ↔ 타입 매핑)

| 구글시트 | 타입 | 파일 |
| --- | --- | --- |
| `1_수리접수기록` | `RepairTicket` | `src/types/repair.ts` |
| `2_자산등록기록`, `4_자산목록` | `Asset` | `src/types/asset.ts` |
| `3_변경로그` | `ChangeLog` | `src/types/changeLog.ts` |
| `5_사용자목록` | `AppUser` | `src/types/user.ts` |
| (소모품 재고) | `Consumable` | `src/types/consumable.ts` |

## 3. 설계 원칙

- **단일 책임**: 컴포넌트 하나는 한 가지 역할만. 파일당 300줄 이내.
- **선택 옵션은 `constants/`에 `as const`로 정의**하고 타입을 파생 → 옵션 추가 시 한 곳만 수정.
- **중복 로직은 `lib/`(순수 함수) 또는 `hooks/`(상태 로직)로 분리.**
- **경로 별칭 `@/`** 로 상대경로 depth를 줄임.
- **모든 함수에 JSDoc**, 비자명한 로직에는 "왜"를 설명하는 주석.

## 4. 폴더 역할

| 폴더 | 역할 | 예시 |
| --- | --- | --- |
| `types/` | 도메인 타입만 | `Asset`, `RepairTicket` |
| `constants/` | 값·enum | `MANUFACTURERS`, `DEPARTMENTS` |
| `lib/` | 순수 유틸 (부수효과 없음) | `formatCurrency` |
| `hooks/` | 상태·부수효과 로직 | `useAssets` |
| `components/ui/` | 표현용 순수 UI | `StatCard`, `Badge` |
| `components/layout/` | 레이아웃 골격 | `Sidebar`, `AppShell` |
| `features/*` | 화면 단위 기능 | `dashboard`, `repair-request` |
