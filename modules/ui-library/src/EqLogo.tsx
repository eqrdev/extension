import { EqIcon } from './EqIcon'
import styled from '@emotion/styled'
import { ReactElement } from 'react'

export interface EqLogoProps {
  size?: number
  inverse?: boolean
}

const Styled = {
  Wrapper: styled.div<EqLogoProps>(({ inverse, size }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: inverse ? 'transparent' : 'var(--eq-color-n500)',
    color: inverse ? 'var(--eq-color-n500)' : 'var(--eq-color-white)',
    width: size,
    height: size,
  })),
}

export const EqLogo = ({
  size = 40,
  inverse = false,
  ...props
}: EqLogoProps): ReactElement => (
  <Styled.Wrapper inverse={inverse} size={size} {...props}>
    <EqIcon size={(size / 4) * 3} type="equalizer" />
  </Styled.Wrapper>
)
