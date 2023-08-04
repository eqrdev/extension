import { EqIcon } from './EqIcon'
import styled from '@emotion/styled'
import { ReactElement } from 'react'

export interface EqAlertProps {
  severity?: string
  closable?: boolean
  children: string
  small?: boolean
}

const Styled = {
  Wrapper: styled.div<Pick<EqAlertProps, 'severity' | 'small'>>(
    ({ small }) => ({
      borderRadius: 4,
      padding: small ? 8 : 16,
      display: 'flex',
      gap: 12,
    }),
    ({ severity }) =>
      severity === 'error' && {
        background: 'var(--eq-color-e300)',
        color: 'var(--eq-color-white)',
      },
    ({ severity }) =>
      severity === 'alert' && {
        background: 'var(--eq-color-w300)',
        color: 'var(--eq-color-white)',
      },
    ({ severity }) =>
      severity === 'alert' && {
        background: 'var(--eq-color-n100)',
        color: 'var(--eq-color-n400)',
      }
  ),
  Content: styled.div<{ small: boolean }>(({ small }) => ({
    fontSize: small ? '13px' : '15px',
    lineHeight: '21px',
  })),
}

export const EqAlert = ({
  severity,
  closable,
  children,
  small = false,
  ...props
}: EqAlertProps): ReactElement => (
  <Styled.Wrapper severity={severity} small={small} {...props}>
    <EqIcon
      type={
        {
          info: 'info',
          warning: 'error_outline',
          error: 'highlight_off',
        }[severity]
      }
    />
    <Styled.Content small={small}>{children}</Styled.Content>
    {closable && <EqIcon type="close" />}
  </Styled.Wrapper>
)
