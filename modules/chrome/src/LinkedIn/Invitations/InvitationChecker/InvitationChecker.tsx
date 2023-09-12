import { ReactElement, useContext, useEffect, useState } from 'react'
import { EqAlert, EqButton, EqLogo, EqTypo, useSnackbar } from 'ui-library'
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
    margin: '0 auto 0 0',
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
  const [firstLoading, setFirstLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const presenter = new InvitationCheckerPresenter()
  const showSnackbar = useSnackbar()

  const loadData = async () => {
    await presenter.load(setData)
    setFirstLoading(false)
  }

  const showSuccessfulCheck = () => {
    showSnackbar({
      severity: 'success',
      message: `${$i18n('invitationsSuccessfulCheck')} ${
        data.invitationsAcceptedCount
          ? $i18n('invitationsAccepted', [
              String(data.invitationsAcceptedCount),
            ])
          : $i18n('noInvitationsAccepted')
      }`,
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleClick = async () => {
    setLoading(true)
    await presenter.onClickButton()
    showSuccessfulCheck()
    setLoading(false)
  }

  return firstLoading ? (
    <Styled.Wrapper>...</Styled.Wrapper>
  ) : (
    <Styled.Wrapper>
      <Styled.Logo>
        <EqLogo />
        <EqTypo small bold>
          Equalizer
        </EqTypo>
      </Styled.Logo>
      {data.isProfileNameProvided ? (
        <>
          {data.lastCheck && (
            <Styled.LastCheck small>
              {$i18n('lastCheck', [data.lastCheck])}
            </Styled.LastCheck>
          )}
          <EqButton outline onClick={handleClick} loading={loading}>
            {$i18n('checkInvitations')}
          </EqButton>
        </>
      ) : (
        <>
          <Styled.Alert severity="error" small>
            {$i18n('missingUrlMessageChecker')}
          </Styled.Alert>
          <EqButton size="small" outline onClick={presenter.onClickSettings}>
            {$i18n('openSettings')}
          </EqButton>
        </>
      )}
    </Styled.Wrapper>
  )
}
