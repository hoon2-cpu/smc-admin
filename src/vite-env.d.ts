/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 프론트엔드 → GAS 요청 검증용 공유 토큰 (.env의 VITE_API_TOKEN). */
  readonly VITE_API_TOKEN?: string
}
