import { ContentElement } from '../../Shared/ContentElement'
import { MessageCheckerPresenter } from './MessageCheckerPresenter'
import { i18n } from '../../../Shared/i18n'

export class MessageChecker extends ContentElement<HTMLDivElement> {
  id = 'eq-message-checker'
  clickHandler: () => Promise<void>

  private presenter: MessageCheckerPresenter

  constructor() {
    super()
    this.presenter = new MessageCheckerPresenter()
  }

  create(): HTMLDivElement {
    const div = document.createElement('div')
    div.innerHTML = `
    <div class="logo">
      <svg width="48" height="48" viewBox="0 -960 960 960">
        <path d="M160-160v-320h140v320H160Zm250 0v-640h140v640H410Zm250 0v-440h140v440H660Z"></path>
      </svg>
      <span>Equalizer</span>
    </div>
    <button>${i18n('checkMessages')}</button>
    <div class="last-checked"></div>`

    div.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: stretch;
      background: #272727;
      padding: 8px 12px;
      color: white;`

    div.querySelector<HTMLDivElement>('.logo').style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      fill: white;
      color: white;
      font-size: 12px;
      gap: 6px;`

    div.querySelector<SVGSVGElement>('svg').style.cssText = `
      width: 24px;
      height: 24px;`

    div.querySelector<HTMLButtonElement>('button').style.cssText = `
      background: white;
      color: #272727;
      border-radius: 4px;
      padding: 7px 12px;
      margin: 8px 0;`

    div.querySelector<HTMLDivElement>('.last-checked').style.cssText = `
      font-size: 11px;
      text-align: center;
      color: #9A9C9E;`

    return div
  }

  injectorMethod(element: HTMLDivElement): void {
    this.presenter.load(({ lastChecked, onClickMessages }) => {
      this.clickHandler = onClickMessages

      if (!lastChecked) {
        return
      }

      element.querySelector<HTMLDivElement>('.last-checked').innerText = i18n(
        'lastCheck',
        [lastChecked]
      )
    })
    const title = document.querySelector(
      '.msg-conversations-container__title-row'
    )

    title.parentNode.insertBefore(element, title.nextSibling)
  }

  injectedCallback(element: HTMLDivElement): void {
    const button = element.querySelector('button')
    button.addEventListener('click', async () => {
      await this.clickHandler()
    })
  }
}
