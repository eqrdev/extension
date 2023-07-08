import { EqIconButton } from './EqIconButton'
import { ReactElement, useState } from 'react'
import styled from '@emotion/styled'
import { EqIcon } from './EqIcon'

export interface EqCopyButtonProps {
  text: string
  copiedMessage: string
}

const Styled = {
  Wrapper: styled.div({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  }),
  Button: styled(EqIconButton)({}),
  Feedback: styled.div<{ visible: boolean }>(({ visible }) => ({
    opacity: visible ? 1 : 0,
    visibility: visible ? 'visible' : 'hidden',
    translate: visible ? '0 0' : '16px 0',
    pointerEvents: 'none',
    display: 'flex',
    padding: '4px 6px',
    alignItems: 'center',
    gap: 4,
    borderRadius: 4,
    background: 'var(--eq-color-s300)',
    color: 'var(--eq-color-white)',
    fontSize: '13px',
    fontFamily: 'var(--eq-font-primary), sans-serif',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '16px',
    position: 'absolute',
    right: 'calc(100% + 4px)',
    transition: `
      visibility .1s ease,
      translate .1s ease,
      opacity .1s ease`,
  })),
}

export const EqCopyButton = ({
  text,
  copiedMessage,
}: EqCopyButtonProps): ReactElement => {
  const COPIED_MESSAGE_HIDE_TIMEOUT = 3000

  const [messageVisible, setMessageVisible] = useState(false)
  const [currentTimeout, setCurrentTimeout] = useState<number | null>(null)

  const toggleMessage = (copied?: boolean) => {
    if (messageVisible && currentTimeout) {
      clearTimeout(currentTimeout)
      setCurrentTimeout(null)
    }

    setMessageVisible(copied)
  }

  const copyText = async text => {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/plain': new Blob([text], {
          type: 'text/plain',
        }),
      }),
    ])
  }

  const handleClick = async () => {
    if (messageVisible) {
      toggleMessage(false)
    }

    await copyText(text)

    toggleMessage(true)

    setCurrentTimeout(
      setTimeout(() => {
        toggleMessage(false)
      }, COPIED_MESSAGE_HIDE_TIMEOUT)
    )
  }

  return (
    <Styled.Wrapper>
      <Styled.Feedback visible={messageVisible}>
        <EqIcon size={16} type="check_circle_outline" />
        <span>{copiedMessage}</span>
      </Styled.Feedback>
      <Styled.Button onClick={handleClick} icon="content_copy" />
    </Styled.Wrapper>
  )
}
