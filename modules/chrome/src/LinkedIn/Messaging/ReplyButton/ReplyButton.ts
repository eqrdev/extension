import { ContentElement } from '../../Shared/ContentElement'
import { ReplyButtonPresenter } from './ReplyButtonPresenter'

export class ReplyButton extends ContentElement<HTMLDivElement> {
  id = 'eq-reply-button'

  private text: string

  create(): HTMLDivElement {
    const button = document.createElement('div')
    const linkedinCSSClasses = [
      'artdeco-button',
      'artdeco-button--circle',
      'artdeco-button--muted',
      'artdeco-button--2',
      'artdeco-button--tertiary',
    ]
    button.classList.add(...linkedinCSSClasses)
    button.innerHTML = `
    <svg width="48" height="48" viewBox="0 -960 960 960">
      <path d="M160-160v-320h140v320H160Zm250 0v-640h140v640H410Zm250 0v-440h140v440H660Z"></path>
    </svg>
  `
    const svg = button.querySelector('svg')
    svg.style.cssText = `
    width: 24px;
    height: 24px;
    fill: currentColor;`

    return button
  }

  async injectorMethod(element): Promise<void> {
    const presenter = new ReplyButtonPresenter()
    const injectionPoint = document.querySelector('.msg-form__left-actions')

    await presenter.load(({ automaticMessage, isProfileUrlProvided }) => {
      this.text = automaticMessage
      if (!isProfileUrlProvided) {
        return
      }
      injectionPoint.appendChild(element)
    })
  }

  injectedCallback(element: HTMLDivElement): void {
    element.addEventListener('click', () => {
      this.pasteTextToElement(
        this.text,
        document.querySelector('.msg-form__contenteditable')
      )
    })
  }

  private emptyTextarea(element: HTMLElement): void {
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

  private pasteTextToElement(text: string, element: HTMLElement): void {
    this.emptyTextarea(element)

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
    }, 1000)
  }
}
