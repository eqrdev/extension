import { ReactElement, ReactNode } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

export interface EqHeaderProps {
  children: ReactNode
  level?: 1 | 2 | 3 | 4
}

const styleMap = {
  h1: [34, 38],
  h2: [28, 32],
  h3: [24, 28],
  h4: [20, 25],
}

const getCss = (level: EqHeaderProps['level']) =>
  css({
    fontSize: styleMap[`h${level}`][0],
    lineHeight: styleMap[`h${level}`][1] + 'px',
  })

const Styled = {
  Header: styled.h2<EqHeaderProps>(
    {
      margin: 0,
      fontWeight: 700,
    },
    ({ level }) => getCss(level)
  ),
}

export const EqHeader = ({
  children,
  level = 2,
}: EqHeaderProps): ReactElement => (
  <Styled.Header level={level}>{children}</Styled.Header>
)
