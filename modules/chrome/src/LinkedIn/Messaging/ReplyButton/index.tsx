import { I18nProvider } from '../../../Shared/I18nProvider'
import { EqGlobal } from 'ui-library'
import { ReplyButton } from './ReplyButton'

export const App = () => (
  <I18nProvider>
    <EqGlobal cacheId="eq-linkedin">
      <ReplyButton />
    </EqGlobal>
  </I18nProvider>
)
