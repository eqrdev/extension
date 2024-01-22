import { ConfigurationValidator } from 'equalizer'
import {
  ChangeEventHandler,
  FocusEventHandler,
  useEffect,
  useState,
} from 'react'
import { AutoConnectSettings } from '../../Types/AutoConnectStoredData'
export const Settings = () => {
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(new Set())
  const [config, setConfig] = useState<AutoConnectSettings>(null)

  const loadData = async () => {
    setConfig(await window.autoConnect.getSettings())
    setLoading(false)
  }

  useEffect(() => {
    void loadData()
  }, [])

  const hasErrors = errors.size !== 0

  const handleBlur: FocusEventHandler<HTMLInputElement> = async ({
    target,
  }) => {
    const newErrorsSet = new Set(errors)

    async function validate(
      condition: (value: string) => Promise<boolean> | boolean,
      errorString: string,
    ) {
      const isValid = await condition(target.value)
      newErrorsSet[isValid ? 'delete' : 'add'](errorString)
    }

    await validate(
      ConfigurationValidator.isEqualizerProfileNameValid,
      'invalidUser',
    )
    await validate((value) => !!value, 'invalidToken')
    await validate(ConfigurationValidator.isMessageValid, 'invalidMessage')

    setErrors(newErrorsSet)
  }

  const handleInput: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setConfig({
      ...config,
      [target.name]: target.value,
    })
  }

  const save = async () => {
    await window.autoConnect.saveSettings(config)
  }

  return loading ? null : (
    <form>
      {hasErrors && (
        <div>
          {[...errors].map((error: string) => (
            <div>{error}</div>
          ))}
        </div>
      )}
      <input
        name="username"
        value={config.username}
        onInput={handleInput}
        onBlur={handleBlur}
        type="text"
        placeholder="username"
      />
      <input
        name="token"
        value={config.token}
        onInput={handleInput}
        onBlur={handleBlur}
        type="text"
        placeholder="Active LinkedIn session token"
      />
      <textarea
        value={config.message}
        onInput={
          handleInput as unknown as ChangeEventHandler<HTMLTextAreaElement>
        }
        onBlur={handleBlur as unknown as FocusEventHandler<HTMLTextAreaElement>}
        name="message"
        placeholder="Message to the recruiters"
      />
      <input
        value={config.openAiKey}
        onInput={handleInput}
        onBlur={handleBlur}
        name="openAiKey"
        type="text"
        placeholder="OpenAI API key"
      />
      <button disabled={!hasErrors} onClick={save}>
        Save
      </button>
    </form>
  )
}
