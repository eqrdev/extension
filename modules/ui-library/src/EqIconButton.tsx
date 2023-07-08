import { EqButton } from './EqButton'
import styled from '@emotion/styled'
import { HTMLAttributes, ReactElement } from 'react'

export interface EqIconButtonProps {
  icon: string
}

const Styled = {
  Button: styled(EqButton)({
    height: 'auto',
    padding: 8,
    borderRadius: '100%',
    background: 'none',
    transition: 'background .2s ease',
    color: 'var(--eq-color-n400)',

    '&:hover': {
      background: 'rgba(0, 0, 0, .1)',
    },

    '&:active': {
      background: 'rgba(0, 0, 0, .3)',
    },
  }),
}

export const EqIconButton = ({
  icon,
  ...props
}: EqIconButtonProps & HTMLAttributes<HTMLButtonElement>): ReactElement => (
  <Styled.Button icon={icon} {...props} />
)
