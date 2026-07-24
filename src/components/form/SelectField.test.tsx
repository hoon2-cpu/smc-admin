import { render, screen, fireEvent } from '@testing-library/react'
import SelectField from './SelectField'

describe('SelectField', () => {
  it('옵션을 모두 렌더링한다', () => {
    render(<SelectField value="" onChange={() => {}} options={['SAMSUNG', 'LG', 'APPLE']} />)
    expect(screen.getByRole('option', { name: 'SAMSUNG' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'LG' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'APPLE' })).toBeInTheDocument()
  })

  it('선택 변경 시 onChange에 선택 값을 전달한다', () => {
    let selected = ''
    render(
      <SelectField
        value=""
        onChange={(v) => {
          selected = v
        }}
        options={['SAMSUNG', 'LG']}
      />,
    )
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'LG' } })
    expect(selected).toBe('LG')
  })
})
