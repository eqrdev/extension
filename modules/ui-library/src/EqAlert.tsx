import { EqIcon } from './EqIcon'
import styled from '@emotion/styled'
import { ReactElement } from 'react'
import { EqIconButton } from './EqIconButton'

type Severity = 'info' | 'warning' | 'error' | 'success'

export interface EqAlertProps {
  severity?: Severity
  closable?: boolean
  children: string
  small?: boolean
  onClose?: () => void
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
      severity === 'info' && {
        background: 'var(--eq-color-w300)',
        color: 'var(--eq-color-white)',
      },
    ({ severity }) =>
      severity === 'success' && {
        background: 'var(--eq-color-s300)',
        color: 'var(--eq-color-white)',
      },
    ({ severity }) =>
      severity === 'warning' && {
        background: 'var(--eq-color-n100)',
        color: 'var(--eq-color-n400)',
      }
  ),
  Content: styled.div<{ small: boolean }>(({ small }) => ({
    fontSize: small ? '13px' : '15px',
    lineHeight: '21px',
  })),
  Close: styled(EqIconButton)({
    flex: '42px 0 0',
  }),
}

export const EqAlert = ({
  severity = 'error',
  closable,
  children,
  small = false,
  onClose,
  ...props
}: EqAlertProps): ReactElement => (
  <Styled.Wrapper severity={severity} small={small} {...props}>
    <EqIcon
      type={
        {
          info: 'info',
          warning: 'error_outline',
          error: 'highlight_off',
          success: 'check_circle',
        }[severity]
      }
    />
    <Styled.Content small={small}>{children}</Styled.Content>
    {closable && <Styled.Close small inverse icon="close" onClick={onClose} />}
  </Styled.Wrapper>
)
