import styled from '@emotion/styled'
import { EqIcon } from './EqIcon'
import { forwardRef, HTMLAttributes, ReactElement, ReactNode } from 'react'

export interface EqButtonProps {
  icon?: string
  size?: 'large' | 'small' | 'default'
  outline?: boolean
  children?: ReactNode
}

const Styled = {
  Button: styled.button<Pick<EqButtonProps, 'size' | 'outline'>>(
    {
      border: 0,
      borderRadius: 4,
      fontFamily: 'var(--eq-font-secondary)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
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
}

export const EqButton = forwardRef<
  HTMLButtonElement,
  EqButtonProps & HTMLAttributes<HTMLButtonElement>
>(
  ({ icon, size, outline, children, ...props }, ref): ReactElement => (
    <Styled.Button size={size} outline={outline} {...props} ref={ref}>
      {icon && <Styled.Icon type={icon} />}
      {children}
    </Styled.Button>
  )
)
