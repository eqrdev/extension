import enMessages from '../../_locales/en_US/messages.json'
import { createContext, ReactElement, ReactNode } from 'react'

type MessageKey = keyof typeof enMessages

interface I18nContextInterface {
  $i18n(key: MessageKey, substitutions?: string | string[]): string
}

export const I18nContext = createContext<Partial<I18nContextInterface>>({})

export const I18nProvider = ({
  children,
}: {
  children: ReactNode
}): ReactElement => (
  <I18nContext.Provider value={{ $i18n: chrome.i18n.getMessage }}>
    {children}
  </I18nContext.Provider>
)
