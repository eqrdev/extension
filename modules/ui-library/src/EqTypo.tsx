import { JSX, ReactNode } from 'react'
import styled from '@emotion/styled'

export interface EqTypoProps {
  small?: boolean
  link?: boolean
  bold?: boolean
  monospace?: boolean
  tag?: keyof JSX.IntrinsicElements
  children: ReactNode
  href?: string
}

const Styled = {
  Tag: styled.span<Pick<EqTypoProps, 'small' | 'bold' | 'link' | 'monospace'>>(
    ({ small, bold, link, monospace }) => ({
      color: 'var(--eq-color-n400)',
      fontFamily: monospace ? 'monospace' : 'var(--eq-font-primary)',
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
  monospace = false,
  children,
  ...props
}: EqTypoProps) => (
  <Styled.Tag
    as={tag}
    small={small}
    link={link}
    bold={bold}
    monospace={monospace}
    {...props}
  >
    {children}
  </Styled.Tag>
)
