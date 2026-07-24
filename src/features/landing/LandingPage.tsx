import { Link } from 'react-router-dom'
import './LandingPage.css'

/**
 * 메인 랜딩 페이지.
 * 배경 영상(회사소개/자산관리) 위에 자산관리 홈페이지 진입 버튼을 표시합니다.
 * 영상 파일은 `public/videos/main_video.mp4` 를 사용합니다.
 *
 * @returns 랜딩 페이지 엘리먼트
 */
export default function LandingPage() {
  return (
    <div className="landing">
      {/* 배경 영상 — 자동재생 정책상 muted 필수, loop로 반복 재생 */}
      <video
        className="landing-bg"
        src={`${import.meta.env.BASE_URL}videos/main_video.mp4`}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="landing-overlay" />

      <div className="landing-inner">
        {/* <h1 className="landing-title">IT 자산 &amp; 관리 시스템</h1> */}

        <Link to="/asset" className="landing-enter">
          자산관리 홈페이지 바로가기 →
        </Link>
      </div>
    </div>
  )
}
