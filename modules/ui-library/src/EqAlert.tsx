import { EqIcon } from './EqIcon'
import styled from '@emotion/styled'
import { ReactElement } from 'react'

export interface EqAlertProps {
  severity?: string
  closable?: boolean
  children: string
}

const Styled = {
  Wrapper: styled.div<Pick<EqAlertProps, 'severity'>>(
    {
      borderRadius: 4,
      padding: 16,
      display: 'flex',
      gap: 12,
    },
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
  Content: styled.div({
    fontSize: '15px',
    lineHeight: '21px',
  }),
}

export const EqAlert = ({
  severity,
  closable,
  children,
}: EqAlertProps): ReactElement => (
  <Styled.Wrapper severity={severity}>
    <EqIcon
      type={
        {
          info: 'info',
          warning: 'error_outline',
          error: 'highlight_off',
        }[severity]
      }
    />
    <Styled.Content>{children}</Styled.Content>
    {closable && <EqIcon type="close" />}
  </Styled.Wrapper>
)
