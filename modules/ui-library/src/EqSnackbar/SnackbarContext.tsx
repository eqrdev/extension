import { createContext, ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Snackbars } from './Snackbars'
import { SnackbarProps } from './Snackbar'

const ROOT_ID = 'eq-snackbar-root'

export interface SnackbarContextInterface {
  snackbars: SnackbarProps[]
  setSnackbars: (snackbars: SnackbarProps[]) => void
}

export const SnackbarContext = createContext<SnackbarContextInterface>(
  {} as SnackbarContextInterface
)

export const SnackbarContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [mounted, setMounted] = useState(false)
  const [snackbars, setSnackbars] = useState<SnackbarProps[]>([])

  const createDiv = () => {
    const div = document.createElement('div')
    div.id = ROOT_ID
    document.body.appendChild(div)
    return div
  }

  const getMountElement = () => document.getElementById(ROOT_ID) ?? createDiv()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <SnackbarContext.Provider value={{ snackbars, setSnackbars }}>
      {children}
      {createPortal(<Snackbars snackbars={snackbars} />, getMountElement())}
    </SnackbarContext.Provider>
  )
}
