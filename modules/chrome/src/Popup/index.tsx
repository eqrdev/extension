import { createRoot } from 'react-dom/client'
import { Popup } from './Popup'
import { I18nProvider } from '../Shared/I18nProvider'
import { EqGlobal } from 'ui-library/src/EqGlobal'

const App = () => (
  <I18nProvider>
    <EqGlobal cacheId="eq-linkedin" resetBody>
      <Popup />
    </EqGlobal>
  </I18nProvider>
)

createRoot(document.getElementById('root')).render(<App />)
