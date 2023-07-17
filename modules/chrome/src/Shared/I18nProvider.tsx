import { createContext, ReactElement, ReactNode } from 'react'
import { GetMessageType, i18n as $i18n } from './i18n'

interface I18nContextInterface {
  $i18n: GetMessageType
}

export const I18nContext = createContext<Partial<I18nContextInterface>>({})

export const I18nProvider = ({
  children,
}: {
  children: ReactNode
}): ReactElement => (
  <I18nContext.Provider value={{ $i18n }}>{children}</I18nContext.Provider>
)
