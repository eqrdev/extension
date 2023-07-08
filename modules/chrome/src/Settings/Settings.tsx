import { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { EqHeader, EqInput, EqLogo, EqTextarea, EqTypo } from 'ui-library'
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
  const inputRef = useRef(null)

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
      await data.onSaveProfileName(inputRef.current.value)
      setEditLink(false)
    } catch (error) {
      if (error.message === 'EmptyValueError') {
        setLinkError($i18n('emptyProfileUrlError'))
      }
    }
  }

  const handleMessageSave = async () => {
    setEditMessage(false)
  }

  const handleApiKeySave = async () => {
    setEditApiKey(false)
  }

  const handleSwitchApiKey = async (checked: boolean) => {
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
              ref={inputRef}
              autoFocus
              defaultValue={data.profileName}
              placeholder={$i18n('yourProfileId')}
            />
          </Styled.LinkEditor>
        ) : (
          <EqTypo>{data.profileUrl}</EqTypo>
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
        {editApiKey && (
          <>
            <EqTypo>{$i18n('apiKeyLabel')}</EqTypo>
            <EqInput
              ref={inputRef}
              autoFocus
              defaultValue={data.openAiKey}
              placeholder={$i18n('apiKeyPlaceholder')}
            />
          </>
        )}
      </SettingsSection>
    </Styled.Wrapper>
  )
}
