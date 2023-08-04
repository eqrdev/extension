import { ReactElement, useContext, useEffect, useState } from 'react'
import { EqAlert, EqButton, EqLogo, EqTypo } from 'ui-library'
import { I18nContext } from '../../../Shared/I18nProvider'
import styled from '@emotion/styled'
import {
  InvitationCheckerPresenter,
  InvitationModel,
} from './InvitationCheckerPresenter'

const Styled = {
  Wrapper: styled.div({
    background: 'var(--eq-color-n500)',
    color: 'var(--eq-color-white)',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
  }),
  Logo: styled.header({
    display: 'flex',
    alignItems: 'center',
  }),
  LastCheck: styled(EqTypo)({
    color: 'var(--eq-color-n300)',
    margin: '0 16px 0 auto',
  }),
  Alert: styled(EqAlert)({
    maxWidth: '304px',
    margin: '0 16px 0 auto',
  }),
}

export const InvitationChecker = (): ReactElement => {
  const { $i18n } = useContext(I18nContext)
  const [data, setData] = useState<Partial<InvitationModel>>({})
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    const presenter = new InvitationCheckerPresenter()
    await presenter.load(setData)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleClick = async () => {
    setLoading(true)
    await data.onClickButton()
    setLoading(false)
  }

  return (
    <Styled.Wrapper>
      <Styled.Logo>
        <EqLogo />
        <EqTypo small bold>
          Equalizer
        </EqTypo>
      </Styled.Logo>
      {data.isProfileNameProvided ? (
        <>
          <Styled.LastCheck small>
            {$i18n('lastCheck', [data.lastCheck])}
          </Styled.LastCheck>
          <EqButton outline onClick={handleClick} loading={loading}>
            {$i18n('checkInvitations')}
          </EqButton>
        </>
      ) : (
        <>
          <Styled.Alert severity="error" small>
            {$i18n('missingUrlMessageChecker')}
          </Styled.Alert>
          <EqButton size="small" outline onClick={data.onClickSettings}>
            {$i18n('openSettings')}
          </EqButton>
        </>
      )}
    </Styled.Wrapper>
  )
}
