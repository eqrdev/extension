import { JSX, ReactNode } from 'react'
import styled from '@emotion/styled'

export interface EqTypoProps {
  small?: boolean
  link?: boolean
  bold?: boolean
  tag?: keyof JSX.IntrinsicElements
  children: ReactNode
}

const Styled = {
  Tag: styled.span<Pick<EqTypoProps, 'small' | 'bold' | 'link'>>(
    ({ small, bold, link }) => ({
      fontFamily: 'var(--eq-font-primary)',
      fontSize: small ? 13 : 15,
      lineHeight: small ? '16px' : '21px',
      fontWeight: bold ? 700 : 400,
      textDecoration: link ? 'underline' : undefined,
    })
  ),
}

export const EqTypo = ({
  tag,
  link = false,
  bold = false,
  small = false,
  children,
  ...props
}: EqTypoProps) => (
  <Styled.Tag as={tag} small={small} link={link} bold={bold} {...props}>
    {children}
  </Styled.Tag>
)
