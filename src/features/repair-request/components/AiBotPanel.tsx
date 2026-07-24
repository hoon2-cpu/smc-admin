import { Bot, Send } from 'lucide-react'
import './AiBotPanel.css'

/** AI 봇이 처음 제시하는 추천 질문 목록. */
const SUGGESTED_QUESTIONS = [
  '수리 진행 상황은 어떻게 확인하나요?',
  '자산 등록 방법을 알려주세요',
  '자주 발생하는 문제는 어떤 게 있나요?',
  '비밀번호 초기화 방법은?',
]

/**
 * AI 질문응답 봇 패널. (이미지 ③ 우측 하단)
 * 실제 응답 생성은 이후 연동하며, 지금은 UI(인사말 + 추천질문 + 입력창)만 제공합니다.
 *
 * @returns AI 봇 패널 엘리먼트
 */
export default function AiBotPanel() {
  return (
    <section className="ai-bot">
      <header className="ai-bot-head">
        <Bot size={18} />
        <span>AI 질문응답 봇</span>
      </header>

      <div className="ai-bot-body">
        <p className="ai-greeting">안녕하세요! IT 지원 봇입니다. 어떤 도움이 필요하신가요?</p>
        <ul className="ai-suggestions">
          {SUGGESTED_QUESTIONS.map((question) => (
            <li key={question}>
              <button type="button">{question}</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="ai-bot-input">
        <input placeholder="질문을 입력하세요..." />
        <button type="button" aria-label="전송">
          <Send size={16} />
        </button>
      </div>
      <p className="ai-disclaimer">AI가 답변을 생성합니다. 정확한 정보를 위해 확인하세요.</p>
    </section>
  )
}
