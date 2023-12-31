import { ReactElement, useContext, useEffect, useState } from 'react'
import { I18nContext } from '../../../Shared/I18nProvider'
import styled from '@emotion/styled'
import { EqAlert, EqButton, EqLogo, EqTypo, useSnackbar } from 'ui-library'
import {
  MessageCheckerData,
  MessageCheckerPresenter,
} from './MessageCheckerPresenter'
import { DOMGateway } from '../../../Shared/Gateways/DOMGateway'

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

    '> div': {
      position: 'relative',
      top: -4,
    },
  }),
  Feedback: styled(EqAlert)({
    margin: '8px 0',
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
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Partial<MessageCheckerData>>({})
  const showSnackbar = useSnackbar()
  const presenter = new MessageCheckerPresenter()
  const domGateway = new DOMGateway()

  const loadData = async () => {
    await presenter.load(setData)
    setLoading(false)
  }

  useEffect(() => {
    loadData()

    domGateway.listen('checked:messages', (event: CustomEvent) => {
      showSuccessSnackbar(event.detail.count)
    })
  }, [])

  const showSuccessSnackbar = (responsesCount: number) => {
    showSnackbar({
      severity: 'success',
      message: `${$i18n('successfulCheck')}\n ${
        responsesCount
          ? $i18n('responsesSent', [String(responsesCount)])
          : $i18n('noResponsesSent')
      }`,
    })
  }

  const handleClick = async () => {
    setLoading(true)
    await presenter.onClickMessages()
    setLoading(false)
  }

  return (
    <Styled.Wrapper>
      <Styled.Logo>
        <EqLogo size={24} />
        <span>Equalizer</span>
      </Styled.Logo>
      {data.shouldShowCheckerButton || loading ? (
        <>
          <Styled.Button
            outline
            size="small"
            onClick={handleClick}
            loading={loading}
          >
            {$i18n('checkMessages')}
          </Styled.Button>
          {data.lastChecked && (
            <Styled.LastChecked>
              {$i18n('lastCheck', [data.lastChecked])}
            </Styled.LastChecked>
          )}
        </>
      ) : (
        <>
          <Styled.Feedback severity="error" small>
            {$i18n('missingUrlMessageChecker')}
          </Styled.Feedback>
          <Styled.Button
            outline
            size="small"
            onClick={presenter.onClickSettings}
            loading={loading}
          >
            {$i18n('openSettings')}
          </Styled.Button>
        </>
      )}
    </Styled.Wrapper>
  )
}
