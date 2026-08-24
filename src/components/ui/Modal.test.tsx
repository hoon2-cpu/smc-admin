import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './Modal'

describe('Modal', () => {
  it('open=false면 렌더링하지 않는다', () => {
    render(
      <Modal open={false} title="제목" onClose={() => {}}>
        내용
      </Modal>,
    )
    expect(screen.queryByText('제목')).not.toBeInTheDocument()
  })

  it('open=true면 제목과 내용을 렌더링한다', () => {
    render(
      <Modal open title="자산 등록" onClose={() => {}}>
        본문
      </Modal>,
    )
    expect(screen.getByText('자산 등록')).toBeInTheDocument()
    expect(screen.getByText('본문')).toBeInTheDocument()
  })

  it('닫기 버튼 클릭 시 onClose를 호출한다', () => {
    let closed = false
    render(
      <Modal open title="제목" onClose={() => (closed = true)}>
        본문
      </Modal>,
    )
    fireEvent.click(screen.getByLabelText('닫기'))
    expect(closed).toBe(true)
  })
})
