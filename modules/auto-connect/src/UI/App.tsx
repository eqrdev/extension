import { ConfigurationValidator } from 'equalizer'
import { FocusEventHandler, useState } from 'react'
import { AutoConnectSettings } from '../Types/AutoConnectStoredData'

export const App = () => {
  const [errors, setErrors] = useState([])
  const [config, setConfig] = useState<AutoConnectSettings>()

  const handleBlurName: FocusEventHandler<HTMLInputElement> = (event) => {
    if (
      !ConfigurationValidator.isEqualizerProfileNameValid(event.target.value)
    ) {
      setErrors(['invalidUser'])
      return
    }

    setErrors([])

    setConfig({
      ...config,
      username: event.target.value,
    })
  }

  return (
    <form>
      <input
        type="text"
        placeholder="Your Equalizer username"
        onBlur={handleBlurName}
      />
      {errors.includes('invalidUser') && <div>invalid user</div>}
      <input type="text" placeholder="Active LinkedIn session token" />
      <textarea placeholder="Message to the recruiters" />
      <input type="text" placeholder="OpenAI API key" />
    </form>
  )
}
