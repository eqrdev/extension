import { I18nProvider } from '../../../Shared/I18nProvider'
import { EqGlobal } from 'ui-library'
import { InvitationChecker } from './InvitationChecker'

export const App = () => (
  <I18nProvider>
    <EqGlobal cacheId="eq-linkedin">
      <InvitationChecker />
    </EqGlobal>
  </I18nProvider>
)
