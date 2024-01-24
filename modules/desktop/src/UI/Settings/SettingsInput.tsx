import { AllHTMLAttributes, forwardRef } from 'react'
import styled from '@emotion/styled'

export type SettingsInputProps = {
  label: string
  error?: string
  isTextarea?: boolean
}

const Styled = {
  Wrapper: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  Label: styled.label`
    font-size: 13px;
    font-weight: bold;
    color: var(--color-text);
  `,
  Input: styled.input<{ invalid: boolean }>`
    border: 0;
    border-radius: 3px;
    padding: 6px;
    outline: 0;
    background: var(--color-toolbar-background);
    color: var(--color-white);
    font-family: sans-serif;
    font-size: 16px;
    box-shadow: ${({ invalid }) => (invalid ? '0 0 0 2px #FF453A' : '')};
    resize: none;
    width: 100%;
    box-sizing: border-box;

    &:focus {
      box-shadow: 0 0 0 2px var(--color-accent);
    }
  `,
  Error: styled.div`
    color: #ff453a;
    font-size: 11px;
  `,
}

export const SettingsInput = forwardRef<
  HTMLInputElement,
  SettingsInputProps & AllHTMLAttributes<HTMLInputElement>
>(({ label, error, isTextarea, as, ...rest }, ref) => {
  return (
    <Styled.Wrapper>
      <Styled.Label>{label}</Styled.Label>
      <Styled.Input
        as={isTextarea ? 'textarea' : undefined}
        ref={ref}
        invalid={Boolean(error)}
        rows={4}
        {...rest}
      />
      <Styled.Error>&nbsp;{error}</Styled.Error>
    </Styled.Wrapper>
  )
})
