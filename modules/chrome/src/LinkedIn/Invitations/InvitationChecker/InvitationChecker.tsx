import { ReactElement, useContext, useEffect, useState } from 'react'
import { EqButton, EqLogo, EqTypo } from 'ui-library'
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
}

export const InvitationChecker = (): ReactElement => {
  const { $i18n } = useContext(I18nContext)
  const [data, setData] = useState<Partial<InvitationModel>>({})

  const loadData = async () => {
    const presenter = new InvitationCheckerPresenter()
    await presenter.load(setData)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Styled.Wrapper>
      <Styled.Logo>
        <EqLogo />
        <EqTypo small bold>
          Equalizer
        </EqTypo>
      </Styled.Logo>
      <Styled.LastCheck small>
        {$i18n('lastCheck', ['július 17'])}
      </Styled.LastCheck>
      <EqButton outline onClick={data.onClickButton}>
        {$i18n('checkInvitations')}
      </EqButton>
    </Styled.Wrapper>
  )
}
