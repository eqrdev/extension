import { onLoadPage } from '../../Shared/onLoadPage'
import { I18nProvider } from '../../../Shared/I18nProvider'
import { EqGlobal } from 'ui-library'
import { InvitationChecker } from './InvitationChecker'
import { createRoot } from 'react-dom/client'

const App = () => (
  <I18nProvider>
    <EqGlobal>
      <InvitationChecker />
    </EqGlobal>
  </I18nProvider>
)

onLoadPage('MyNetwork', () => {
  const mount = document.createElement('div')
  const header = document.querySelector('.mn-invitations-preview__header')
  header.parentNode?.insertBefore(mount, header.nextSibling)

  createRoot(mount).render(<App />)
})
