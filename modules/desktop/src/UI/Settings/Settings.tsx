import { ConfigurationValidator, DEFAULT_AUTO_REPLY_TEXT } from 'equalizer'
import {
  ChangeEventHandler,
  FocusEventHandler,
  useEffect,
  useState,
} from 'react'
import { AutoConnectConfig } from 'auto-connect'
import styled from '@emotion/styled'
import { SettingsInput } from './SettingsInput'
import { Button } from '../MacOSUI/Button'

const Styled = {
  Wrapper: styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
}
export const Settings = () => {
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(new Set())
  const [config, setConfig] = useState<AutoConnectConfig>(null)

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
    <Styled.Wrapper>
      <SettingsInput
        label="Equalizer username"
        name="username"
        value={config?.username}
        onInput={handleInput}
        onBlur={handleBlur}
        type="text"
        placeholder="Username"
        error={errors.has('invalidUser') ? 'Invalid username' : undefined}
      />
      <SettingsInput
        label="LinkedIn Token"
        name="token"
        value={config?.token}
        onInput={handleInput}
        onBlur={handleBlur}
        type="text"
        placeholder="Active LinkedIn session token"
      />
      <SettingsInput
        label="Message"
        value={config?.message || DEFAULT_AUTO_REPLY_TEXT}
        onInput={handleInput}
        onBlur={handleBlur}
        name="message"
        placeholder="Message to the recruiters"
        isTextarea
      />
      <SettingsInput
        label="OpenAI API key"
        value={config?.openAiKey}
        onInput={handleInput}
        onBlur={handleBlur}
        name="openAiKey"
        type="text"
        placeholder="OpenAI API key"
      />
      <Button disabled={!hasErrors} onClick={save}>
        Save
      </Button>
    </Styled.Wrapper>
  )
}
