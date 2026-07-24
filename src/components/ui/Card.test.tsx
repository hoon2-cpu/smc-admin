import { render, screen } from '@testing-library/react'
import Card from './Card'

describe('Card', () => {
  it('제목과 본문을 함께 렌더링한다', () => {
    render(<Card title="자산 현황">본문 내용</Card>)
    expect(screen.getByText('자산 현황')).toBeInTheDocument()
    expect(screen.getByText('본문 내용')).toBeInTheDocument()
  })

  it('제목이 없으면 헤더(heading)를 렌더링하지 않는다', () => {
    render(<Card>본문만</Card>)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByText('본문만')).toBeInTheDocument()
  })

  it('action을 제목 우측에 렌더링한다', () => {
    render(
      <Card title="신청 현황" action={<a href="#more">더보기</a>}>
        내용
      </Card>,
    )
    expect(screen.getByText('더보기')).toBeInTheDocument()
  })
})
