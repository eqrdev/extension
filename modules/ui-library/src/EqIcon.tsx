import styled from '@emotion/styled'
import { forwardRef, HTMLAttributes } from 'react'

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

export const EqIcon = forwardRef<
  HTMLSpanElement,
  EqIconProps & HTMLAttributes<HTMLSpanElement>
>(({ type, size = 24, ...props }, ref) => (
  <Styled.Icon
    size={size}
    {...props}
    className={`material-symbols-outlined ${props.className}`}
    ref={ref}
  >
    {type}
  </Styled.Icon>
))
