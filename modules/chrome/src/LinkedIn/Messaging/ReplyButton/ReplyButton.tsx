import { ReactElement, useEffect, useState } from 'react'
import { LinkedInModel, ReplyButtonPresenter } from './ReplyButtonPresenter'
import styled from '@emotion/styled'

const Styled = {
  Logo: styled.svg({
    width: 24,
    height: 24,
    fill: 'currentColor',
  }),
}

export const ReplyButton = (): ReactElement | null => {
  const [data, setData] = useState<Partial<LinkedInModel>>({})

  const loadData = async () => {
    const presenter = new ReplyButtonPresenter()
    await presenter.load(setData)
  }

  useEffect(() => {
    loadData()
  }, [])

  const emptyTextarea = (element: HTMLElement): void => {
    const range = document.createRange()

    range.selectNodeContents(element)

    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
    }

    selection.removeAllRanges()
    selection.deleteFromDocument()
    element.blur()
  }

  const pasteTextToElement = (text: string, element: HTMLElement): void => {
    emptyTextarea(element)

    setTimeout(() => {
      element.focus()
      const dataTransfer = new DataTransfer()
      dataTransfer.setData('text/plain', text)

      element.dispatchEvent(
        new ClipboardEvent('paste', {
          clipboardData: dataTransfer,
          bubbles: true,
          cancelable: true,
        })
      )

      dataTransfer.clearData()
    }, 150)
  }

  const handleClick = () => {
    pasteTextToElement(
      data.automaticMessage,
      document.querySelector('.msg-form__contenteditable')
    )
  }

  return data.isProfileUrlProvided ? (
    <div
      className="artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary"
      onClick={handleClick}
    >
      <Styled.Logo width="48" height="48" viewBox="0 -960 960 960">
        <path d="M160-160v-320h140v320H160Zm250 0v-640h140v640H410Zm250 0v-440h140v440H660Z"></path>
      </Styled.Logo>
    </div>
  ) : null
}
