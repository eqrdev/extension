import { I18nProvider } from '../../../Shared/I18nProvider'
import { EqGlobal } from 'ui-library'
import { MessageChecker } from './MessageChecker'

export const App = () => (
  <I18nProvider>
    <EqGlobal cacheId="eq-linkedin">
      <MessageChecker />
    </EqGlobal>
  </I18nProvider>
)
