import { useContext } from 'react'
import { SnackbarContext } from './SnackbarContext'
import { SnackbarProps } from './Snackbar'

export const useSnackbar = () => {
  const { snackbars, setSnackbars } = useContext(SnackbarContext)

  return (snackbar: SnackbarProps) => {
    setSnackbars([
      ...snackbars,
      {
        ...snackbar,
        onClose: () => {
          setSnackbars([])
        },
      },
    ])
  }
}
