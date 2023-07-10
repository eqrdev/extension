import { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import {
  EqAlert,
  EqHeader,
  EqInput,
  EqLogo,
  EqTextarea,
  EqTypo,
} from 'ui-library'
import { I18nContext } from '../Shared/I18nProvider'
import { SettingsSection } from './SettingsSection'
import { SettingsModel, SettingsPresenter } from './SettingsPresenter'
import { SettingsFeatures } from './SettingsFeatures'

const Styled = {
  Wrapper: styled.div({
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 640,
    margin: '0 auto 72px',
    alignSelf: 'stretch',
    gap: 24,
  }),
  Logo: styled(EqLogo)({
    margin: '24px auto',
  }),
  LinkEditor: styled.div({
    alignSelf: 'stretch',
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    gap: 8,
  }),
}

export const Settings = (): ReactElement => {
  const { $i18n } = useContext(I18nContext)
  const profileNameInput = useRef(null)
  const messageInput = useRef(null)
  const apiKeyInput = useRef(null)

  const [editMessage, setEditMessage] = useState(false)
  const [messageError, setMessageError] = useState('')
  const [editApiKey, setEditApiKey] = useState(false)
  const [apiKeyError, setApiKeyError] = useState('')
  const [editLink, setEditLink] = useState(false)
  const [linkError, setLinkError] = useState('')
  const [data, setData] = useState<Partial<SettingsModel>>({})

  const loadSettings = async () => {
    const settingsPresenter = new SettingsPresenter()
    await settingsPresenter.load(setData)
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleEdit = () => {
    setEditLink(true)
  }

  const handleSaveClick = async () => {
    try {
      setLinkError('')
      await data.onSaveProfileName(profileNameInput.current.value)
      setEditLink(false)
    } catch (error) {
      if (error.message === 'EmptyValueError') {
        setLinkError($i18n('emptyProfileUrlError'))
      }
    }
  }

  const handleMessageSave = async () => {
    try {
      setMessageError('')
      await data.onSaveMessage(messageInput.current.value)
      setEditMessage(false)
    } catch (error) {
      if (error.message === 'EmptyValueError') {
        setMessageError($i18n('emptyMessageError'))
      }
    }
  }

  const handleProfileNameKeydown = async event => {
    if ([' ', 'Enter'].includes(event.key)) {
      await handleSaveClick()
    }
  }

  const handleApiKeySave = async () => {
    try {
      setApiKeyError('')
      await data.onSaveApiKey(apiKeyInput.current.value)
      setEditApiKey(false)
    } catch (error) {
      if (error.message === 'EmptyValueError') {
        setApiKeyError($i18n('emptyApiKeyError'))
      }
    }
  }

  const handleSwitchApiKey = async (checked: boolean) => {
    if (!checked) {
      await data.disableOpenAi()
    }

    setEditApiKey(checked)
  }

  return (
    <Styled.Wrapper>
      <Styled.Logo />
      <EqHeader level={2}>{$i18n('settings')}</EqHeader>
      <SettingsSection
        editing={editLink}
        title={$i18n('yourProfileLink')}
        editable
        onEdit={handleEdit}
        onSave={handleSaveClick}
        copy={data.isProfileUrlProvided ? data.profileUrlFull : undefined}
        error={linkError}
      >
        {editLink ? (
          <Styled.LinkEditor>
            <EqTypo>equalizer.dev/me/</EqTypo>
            <EqInput
              ref={profileNameInput}
              autoFocus
              defaultValue={data.profileName}
              placeholder={$i18n('yourProfileId')}
              onKeyDown={handleProfileNameKeydown}
            />
          </Styled.LinkEditor>
        ) : data.isProfileUrlProvided ? (
          <EqTypo>{data.profileUrl}</EqTypo>
        ) : (
          <EqAlert severity="error">{$i18n('missingUrlSettingsPage')}</EqAlert>
        )}
      </SettingsSection>
      <SettingsSection
        title={$i18n('automaticMessage')}
        editable
        editing={editMessage}
        copy={data.automaticMessage}
        onEdit={() => setEditMessage(true)}
        onSave={handleMessageSave}
        error={messageError}
        footer={<SettingsFeatures />}
      >
        {editMessage ? (
          <>
            <EqTextarea
              ref={messageInput}
              autoFocus
              value={data.rawAutomaticMessage}
              info={$i18n('insertUrlInfo')}
              maxLength={1000}
              characterCount
            />
          </>
        ) : (
          <EqTypo>{data.automaticMessage}</EqTypo>
        )}
      </SettingsSection>
      <SettingsSection
        title={$i18n('openAi')}
        switchable
        editing={editApiKey}
        onSwitch={handleSwitchApiKey}
        onSave={handleApiKeySave}
        error={apiKeyError}
        switched={data.isOpenAiEnabled}
      >
        <EqTypo>{$i18n('openAiDescription')}</EqTypo>
        {(data.openAiKey || editApiKey) && (
          <EqTypo bold small>
            {$i18n('apiKeyLabel')}
          </EqTypo>
        )}
        {editApiKey ? (
          <EqInput
            ref={apiKeyInput}
            autoFocus
            defaultValue={data.openAiKey}
            placeholder={$i18n('apiKeyPlaceholder')}
          />
        ) : (
          data.openAiKey && <EqTypo>{data.openAiKey}</EqTypo>
        )}
      </SettingsSection>
    </Styled.Wrapper>
  )
}
