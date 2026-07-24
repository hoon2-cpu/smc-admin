import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import TextInput from './TextInput'

/** 제어 컴포넌트 테스트용 래퍼. */
function Harness({ clearable = false }: { clearable?: boolean }) {
  const [value, setValue] = useState('노트북')
  return <TextInput value={value} onChange={setValue} clearable={clearable} />
}

describe('TextInput', () => {
  it('입력값 변경 시 onChange가 문자열을 전달한다', () => {
    render(<Harness />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: '모니터' } })
    expect(input.value).toBe('모니터')
  })

  it('clearable일 때 지우기 버튼으로 값을 비운다', () => {
    render(<Harness clearable />)
    fireEvent.click(screen.getByLabelText('지우기'))
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('')
  })
})
