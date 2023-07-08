import styled from '@emotion/styled'
import { ReactElement } from 'react'

export interface EqIconProps {
  type: string
  size?: number
}

const Styled = {
  Icon: styled.span(({ size }: Pick<EqIconProps, 'size'>) => ({
    display: 'inline-block',
    verticalAlign: 'middle',
    height: `${size}px`,
    fontSize: `${size}px`,
    lineHeight: `${size}px`,
  })),
}

export const EqIcon = ({
  type,
  size = 24,
  ...props
}: EqIconProps): ReactElement => (
  <Styled.Icon size={size} {...props} className="material-symbols-outlined">
    {type}
  </Styled.Icon>
)
