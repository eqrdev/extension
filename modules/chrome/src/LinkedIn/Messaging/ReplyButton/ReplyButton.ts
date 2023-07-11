import { ContentElement } from '../../Shared/ContentElement'
import { MessagingPresenter } from '../MessagingPresenter'

export class ReplyButton extends ContentElement<HTMLButtonElement> {
  id = 'eq-reply-button'

  private text: string

  create(): HTMLButtonElement {
    const button = document.createElement('button')
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
    const presenter = new MessagingPresenter()
    const injectionPoint = document.querySelector('.msg-form__left-actions')

    await presenter.load(({ automaticMessage, isProfileUrlProvided }) => {
      this.text = automaticMessage
      if (!isProfileUrlProvided) {
        return
      }
      injectionPoint.appendChild(element)
    })
  }

  injectedCallback(element: HTMLButtonElement): void {
    element.addEventListener('click', () => {
      this.pasteTextToElement(
        this.text,
        document.querySelector('.msg-form__contenteditable')
      )
    })
  }

  private pasteTextToElement(text: string, element: HTMLElement): void {
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
  }
}
