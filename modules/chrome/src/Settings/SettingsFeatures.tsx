import { EqIcon, EqTypo } from 'ui-library'
import styled from '@emotion/styled'
import { ReactElement, useContext } from 'react'
import { I18nContext } from '../Shared/I18nProvider'

const Styled = {
  Details: styled.details({
    color: 'var(--eq-color-n400)',

    '&[open] > summary > .material-symbols-outlined': {
      rotate: '180deg',
    },
  }),
  Summary: styled.summary({
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    listStyle: 'none',
    gap: 4,
    borderRadius: 4,
    '&::-webkit-details-marker': {
      display: 'none',
    },
    ':focus': {
      outline: 'none',
      boxShadow: '0 0 0 2px rgba(39, 39, 39, 0.4)',
    },
  }),
  Icon: styled(EqIcon)({
    color: 'var(--eq-color-n300)',
    transition: 'rotate .3s ease',
  }),
  Content: styled.div({
    display: 'flex',
    flexDirection: 'column',
    gap: 48,
    padding: '24px 0',
  }),
  Section: styled.section<{ right?: boolean }>(
    {
      alignItems: 'center',
      display: 'flex',
      gap: 24,
    },
    ({ right }) =>
      right && {
        flexDirection: 'row-reverse',
      }
  ),
  TextPart: styled.div({
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  }),
}

export const SettingsFeatures = (): ReactElement => {
  const { $i18n } = useContext(I18nContext)

  return (
    <Styled.Details>
      <Styled.Summary>
        <EqTypo>How does it work?</EqTypo>
        <Styled.Icon type="keyboard_arrow_down" />
      </Styled.Summary>
      <Styled.Content>
        <Styled.Section>
          <img src="../assets/images/auto-reply.png" alt={$i18n('autoReply')} />
          <Styled.TextPart>
            <EqTypo bold>{$i18n('autoReply')}</EqTypo>
            <EqTypo>{$i18n('autoReplyText')}</EqTypo>
          </Styled.TextPart>
        </Styled.Section>
        <Styled.Section>
          <img
            src="../assets/images/linkedin-message.png"
            alt={$i18n('linkedinMessage')}
          />
          <Styled.TextPart>
            <EqTypo bold>{$i18n('linkedinMessage')}</EqTypo>
            <EqTypo>{$i18n('linkedinMessageText')}</EqTypo>
          </Styled.TextPart>
        </Styled.Section>
        <Styled.Section>
          <img
            src="../assets/images/extension-features.png"
            alt={$i18n('extensionFeatures')}
          />
          <Styled.TextPart>
            <EqTypo bold>{$i18n('extensionFeatures')}</EqTypo>
            <EqTypo>{$i18n('extensionFeaturesText')}</EqTypo>
          </Styled.TextPart>
        </Styled.Section>
      </Styled.Content>
    </Styled.Details>
  )
}
