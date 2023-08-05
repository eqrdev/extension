import { EqButton } from './EqButton'
import styled from '@emotion/styled'
import { HTMLAttributes, ReactElement } from 'react'

export interface EqIconButtonProps {
  icon: string
  inverse?: boolean
  small?: boolean
}

const Styled = {
  Button: styled(EqButton)<{ inverse?: boolean; small?: boolean }>(
    ({ inverse, small }) => ({
      height: 'auto',
      padding: small ? 0 : 8,
      borderRadius: '100%',
      background: 'none',
      transition: 'background .2s ease',
      color: inverse ? 'var(--eq-color-white)' : 'var(--eq-color-n400)',

      '&:hover': {
        background: inverse ? 'rgba(255, 255, 255, .1)' : 'rgba(0, 0, 0, .1)',
      },

      '&:active': {
        background: inverse ? 'rgba(255, 255, 255, .3)' : 'rgba(0, 0, 0, .3)',
      },
    })
  ),
}

export const EqIconButton = ({
  icon,
  small = false,
  ...props
}: EqIconButtonProps & HTMLAttributes<HTMLButtonElement>): ReactElement => (
  <Styled.Button icon={icon} small={small} {...props} />
)
