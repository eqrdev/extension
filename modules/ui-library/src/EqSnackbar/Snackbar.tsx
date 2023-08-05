import { EqAlert, EqAlertProps } from '../EqAlert'
import { ReactElement } from 'react'

export type SnackbarProps = Pick<EqAlertProps, 'severity' | 'onClose'> & {
  message: string
}

export const Snackbar = ({ message, ...rest }: SnackbarProps): ReactElement => (
  <EqAlert {...rest} closable={true}>
    {message}
  </EqAlert>
)
