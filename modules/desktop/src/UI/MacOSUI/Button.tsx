import { AllHTMLAttributes, forwardRef, PropsWithChildren } from 'react'
import styled from '@emotion/styled'

const Styled = {
  Button: styled.button`
    background: var(--color-accent);
    border-radius: 5px;
    color: #fff;
    border: 0;
    padding: 4px 8px;
    box-shadow:
      0 1px 2.5px rgba(10, 132, 255, 0.24),
      0 0 0 0.5px rgba(10, 132, 255, 0.12);

    &:active {
      background: var(--color-accent-active);
    }
  `,
}

export const Button = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<AllHTMLAttributes<HTMLButtonElement>>
>(({ children, type, as, ...rest }, ref) => {
  return (
    <Styled.Button ref={ref} {...rest}>
      {children}
    </Styled.Button>
  )
})
