import { ContentElement } from '../../Shared/ContentElement'

export class MessageChecker extends ContentElement<HTMLDivElement> {
  id = 'eq-message-checker'

  create(): HTMLDivElement {
    const div = document.createElement('div')
    div.innerHTML = `
    <div class="logo">
      <svg width="48" height="48" viewBox="0 -960 960 960">
        <path d="M160-160v-320h140v320H160Zm250 0v-640h140v640H410Zm250 0v-440h140v440H660Z"></path>
      </svg>
      <span>Equalizer</span>
    </div>
    <button>${chrome.i18n.getMessage('checkMessages')}</button>
    <div class="last-checked">${chrome.i18n.getMessage('lastChecked')}</div>`

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
      color: #9A9C9E;`

    return div
  }

  injectorMethod(element: HTMLDivElement): void {
    const title = document.querySelector(
      '.msg-conversations-container__title-row'
    )

    title.parentNode.insertBefore(element, title.nextSibling)
  }

  injectedCallback(element: HTMLDivElement): void {
    const button = element.querySelector('button')
    button.addEventListener('click', () => {
      this.checkMessages()
    })
  }

  private checkMessages() {
    console.log('We check the messages')
  }
}
