import { forwardRef, InputHTMLAttributes, ReactElement } from 'react'
import { EqIcon } from './EqIcon'
import styled from '@emotion/styled'

export interface EqInputProps {
  icon?: string
}

const Styled = {
  Wrapper: styled.div({
    display: 'flex',
    position: 'relative',
    flex: 1,
  }),
  Icon: styled(EqIcon)({}),
  Input: styled.input({
    flex: 1,
    borderRadius: 4,
    border: '1px solid var(--eq-color-n200)',
    background: 'var(--eq-color-white)',
    padding: '12px 16px',
    lineHeight: '21px',
    fontSize: 15,
    fontFamily: 'var(--eq-font-primary)',

    '&::placeholder': {
      color: 'var(--eq-color-n200)',
    },
  }),
}

export const EqInput = forwardRef<
  HTMLInputElement,
  EqInputProps & InputHTMLAttributes<HTMLInputElement>
>(
  ({ icon, ...props }, ref): ReactElement => (
    <Styled.Wrapper>
      {icon && <Styled.Icon type={icon} />}
      <Styled.Input type="text" {...props} ref={ref} />
    </Styled.Wrapper>
  )
)
