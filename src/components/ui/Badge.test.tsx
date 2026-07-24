import { render, screen } from '@testing-library/react'
import Badge from './Badge'

describe('Badge', () => {
  it('내용과 variant 클래스를 렌더링한다', () => {
    render(<Badge variant="success">완료</Badge>)
    const el = screen.getByText('완료')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('badge-success')
  })

  it('variant를 생략하면 neutral이 기본값이다', () => {
    render(<Badge>기본</Badge>)
    expect(screen.getByText('기본')).toHaveClass('badge-neutral')
  })
})
