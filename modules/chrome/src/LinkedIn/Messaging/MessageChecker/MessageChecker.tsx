import { ReactElement, useContext, useEffect, useState } from 'react'
import { I18nContext } from '../../../Shared/I18nProvider'
import styled from '@emotion/styled'
import { EqButton, EqLogo, EqTypo } from 'ui-library'
import {
  MessageCheckerData,
  MessageCheckerPresenter,
} from './MessageCheckerPresenter'

const Styled = {
  Wrapper: styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    background: 'var(--eq-color-n500)',
    padding: '8px 12px',
    color: 'white',
  }),
  Logo: styled.div({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--eq-color-white)',
    fontSize: 12,
    gap: 6,
  }),
  Button: styled(EqButton)({
    background: 'white',
    color: 'var(--eq-color-n500)',
    borderRadius: 4,
    padding: '7px 12px',
    margin: '8px 0',
  }),
  LastChecked: styled(EqTypo)({
    fontSize: 11,
    textAlign: 'center',
    color: 'var(--eq-color-n300)',
  }),
}

export const MessageChecker = (): ReactElement => {
  const { $i18n } = useContext(I18nContext)
  const [data, setData] = useState<Partial<MessageCheckerData>>({})

  const loadData = async () => {
    const presenter = new MessageCheckerPresenter()
    await presenter.load(setData)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Styled.Wrapper>
      <Styled.Logo>
        <EqLogo size={24} />
        <span>Equalizer</span>
      </Styled.Logo>
      <Styled.Button outline size="small" onClick={data.onClickMessages}>
        {$i18n('checkMessages')}
      </Styled.Button>
      {data.lastChecked && (
        <Styled.LastChecked>
          {$i18n('lastCheck', [data.lastChecked])}
        </Styled.LastChecked>
      )}
    </Styled.Wrapper>
  )
}
