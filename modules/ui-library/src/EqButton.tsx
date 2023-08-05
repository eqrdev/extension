import styled from '@emotion/styled'
import { EqIcon } from './EqIcon'
import { AllHTMLAttributes, forwardRef, ReactElement, ReactNode } from 'react'
import { keyframes } from '@emotion/react'

export interface EqButtonProps {
  icon?: string
  size?: 'large' | 'small' | 'default'
  loading?: boolean
  outline?: boolean
  children?: ReactNode
}

const rotate = keyframes`
  100% {
    rotate: 360deg;
  }
`

const Styled = {
  Button: styled.button<Pick<EqButtonProps, 'size' | 'outline'>>(
    {
      border: 0,
      borderRadius: 4,
      fontFamily: 'var(--eq-font-secondary)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      outline: 0,
      gap: 12,
      transition: `
        background .2s ease,
        box-shadow .2s ease`,

      '&:focus': {
        boxShadow: '0 0 0 2px rgba(39, 39, 39, 0.4)',
      },

      '&:disabled': {
        background: 'var(--eq-color-n200)',
        color: 'var(--eq-color-n300)',
      },
    },
    ({ outline }) =>
      outline
        ? {
            background: 'var(--eq-color-white)',
            boxShadow: 'inset 0 0 2px 0 var(--eq-color-n500)',

            '&:hover': {
              background: 'var(--eq-color-n200)',
            },

            '&:active': {
              background: 'var(--eq-color-n500)',
            },
          }
        : {
            background: 'var(--eq-color-n500)',
            color: 'var(--eq-color-white)',
            '&:hover': {
              background: 'var(--eq-color-n400)',
            },

            '&:active': {
              background: 'rgba(39, 39, 39, 0.80)',
            },
          },
    ({ size }) =>
      size === 'large'
        ? {
            height: 56,
            padding: '16px 24px',
          }
        : size === 'small'
        ? {
            height: 32,
            padding: '7px 12px',
          }
        : {
            height: 48,
            padding: '9px 16px',
          }
  ),
  Icon: styled(EqIcon)({
    lineHeight: '24px',
    height: '24px',
  }),
  Loading: styled.svg({
    animation: `${rotate} .4s linear infinite`,
    transformOrigin: 'center',
    stroke: 'black',
    strokeWidth: 2,
    strokeDashoffset: 3,
    width: 12,
    height: 12,
  }),
  Circle: styled.circle<{ outline?: boolean }>(({ outline }) => ({
    stroke: outline ? 'black' : 'white',
    fill: 'transparent',
    strokeDashoffset: 12,
    strokeDasharray: '15px 3px',
  })),
}

export const EqButton = forwardRef<
  HTMLButtonElement,
  EqButtonProps &
    Omit<AllHTMLAttributes<HTMLButtonElement>, 'as' | 'type' | 'size'>
>(
  (
    { icon, size, outline, children, loading, disabled, ...props },
    ref
  ): ReactElement => (
    <Styled.Button
      size={size}
      outline={outline}
      disabled={disabled || loading}
      {...props}
      ref={ref}
    >
      {icon && <Styled.Icon type={icon} />}
      {children}
      {loading && (
        <Styled.Loading viewBox="0 0 12 12">
          <Styled.Circle r={5} cx={6} cy={6} outline={outline}></Styled.Circle>
        </Styled.Loading>
      )}
    </Styled.Button>
  )
)
