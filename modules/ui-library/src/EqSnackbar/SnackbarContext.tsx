import { createContext, ReactNode, useState } from 'react'
import { createPortal } from 'react-dom'
import { Snackbars } from './Snackbars'

const ROOT_ID = 'eq-snackbar-root'

export const SnackbarContext = createContext({})

export const SnackbarContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [snackbars, setSnackbars] = useState([])

  const createDiv = () => {
    const div = document.createElement('div')
    div.id = ROOT_ID
    document.body.appendChild(div)
    return div
  }

  const getMountElement = () => document.getElementById(ROOT_ID) ?? createDiv()

  return (
    <SnackbarContext.Provider value={{ snackbars, setSnackbars }}>
      {children}
      {createPortal(<Snackbars snackbars={snackbars} />, getMountElement())}
    </SnackbarContext.Provider>
  )
}
