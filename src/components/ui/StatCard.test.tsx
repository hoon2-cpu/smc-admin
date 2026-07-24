import { render, screen } from '@testing-library/react'
import StatCard from './StatCard'

describe('StatCard', () => {
  it('라벨/값/단위/캡션을 모두 렌더링한다', () => {
    render(
      <StatCard label="전체 자산 수" value="1,248" unit="대" caption="지난달 대비 +5.2%" />,
    )
    expect(screen.getByText('전체 자산 수')).toBeInTheDocument()
    expect(screen.getByText('1,248')).toBeInTheDocument()
    expect(screen.getByText('대')).toBeInTheDocument()
    expect(screen.getByText('지난달 대비 +5.2%')).toBeInTheDocument()
  })

  it('아이콘을 전달하면 함께 렌더링한다', () => {
    render(<StatCard label="수리 중" value={28} icon={<span>🔧</span>} tone="orange" />)
    expect(screen.getByText('🔧')).toBeInTheDocument()
    expect(screen.getByText('28')).toBeInTheDocument()
  })
})
