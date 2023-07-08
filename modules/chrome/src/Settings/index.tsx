import { createRoot } from 'react-dom/client'
import { Settings } from './Settings'
import { I18nProvider } from '../Shared/I18nProvider'
import { EqGlobal } from 'ui-library/src/EqGlobal'

const App = () => (
  <I18nProvider>
    <EqGlobal>
      <Settings />
    </EqGlobal>
  </I18nProvider>
)

createRoot(document.getElementById('app')).render(<App />)
