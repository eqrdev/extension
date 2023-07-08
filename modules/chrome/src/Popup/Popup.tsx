import { ReactElement, useContext, useEffect, useState } from 'react'
import { Global } from '@emotion/react'
import styled from '@emotion/styled'
import { EqAlert, EqCopyButton, EqIconButton, EqLogo, EqTypo } from 'ui-library'
import { I18nContext } from '../Shared/I18nProvider'
import { PopupModel, PopupPresenter } from './PopupPresenter'

const Styled = {
  global: `
    body {
      margin: 0;
      color: var(--eq-color-n500);
      background: var(--eq-color-white);
      font-family: var(--eq-font-primary), sans-serif;
    }`,
  Popup: styled.div({
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: 16,
    width: 460,
  }),
  Title: styled.header({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: 'var(--eq-color-n400)',
  }),
  SettingsIcon: styled(EqIconButton)({
    margin: '0 0 0 auto',
  }),
  Section: styled.section({
    borderRadius: 4,
    background: 'var(--eq-color-n100)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    alignSelf: 'stretch',
  }),
  SectionHeader: styled.div({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    minHeight: 21,
    padding: 12,
  }),
  SectionContent: styled.div({
    padding: '0 12px 12px',
  }),
  AiStatus: styled(EqTypo)<{ isEnabled: boolean }>(({ isEnabled }) => ({
    color: isEnabled ? 'var(--eq-color-s300)' : 'var(--eq-color-w300)',
    textTransform: 'uppercase',
  })),
}

export const Popup = (): ReactElement => {
  const { $i18n } = useContext(I18nContext)
  const [data, setData] = useState<Partial<PopupModel>>({})

  const loadData = async () => {
    const popupPresenter = new PopupPresenter()
    await popupPresenter.load(setData)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <>
      <Global styles={Styled.global} />
      <Styled.Popup>
        <Styled.Title>
          <EqLogo />
          <EqTypo bold>Equalizer</EqTypo>
          <Styled.SettingsIcon onClick={data.onClickSettings} icon="settings" />
        </Styled.Title>
        <Styled.Section>
          <Styled.SectionHeader>
            <EqTypo bold>{$i18n('yourProfileLink')}</EqTypo>
            {data.isProfileUrlProvided && (
              <EqCopyButton
                text={data.profileUrlFull}
                copiedMessage={$i18n('copied')}
              />
            )}
          </Styled.SectionHeader>
          <Styled.SectionContent>
            {data.isProfileUrlProvided ? (
              <EqTypo>{data.profileUrl}</EqTypo>
            ) : (
              <EqAlert severity="error">{$i18n('missingUrl')}</EqAlert>
            )}
          </Styled.SectionContent>
        </Styled.Section>
        <Styled.Section>
          <Styled.SectionHeader>
            <EqTypo bold>{$i18n('automaticMessage')}</EqTypo>
            <EqCopyButton
              text={data.automaticMessage}
              copiedMessage={$i18n('copied')}
            />
          </Styled.SectionHeader>
          <Styled.SectionContent>
            <EqTypo>{data.automaticMessage}</EqTypo>
          </Styled.SectionContent>
        </Styled.Section>
        <Styled.Section>
          <Styled.SectionHeader>
            <EqTypo bold>{$i18n('openAi')}</EqTypo>
            <Styled.AiStatus small bold isEnabled={data.isOpenAiEnabled}>
              {$i18n(data.isOpenAiEnabled ? 'enabled' : 'disabled')}
            </Styled.AiStatus>
          </Styled.SectionHeader>
        </Styled.Section>
      </Styled.Popup>
    </>
  )
}
