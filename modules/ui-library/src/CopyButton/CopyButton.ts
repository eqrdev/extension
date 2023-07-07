import { AbstractComponent } from '../AbstractComponent'
import { TemplateProps } from './CopyButton.html'
import getTemplate from './CopyButton.html'
import css from './CopyButton.css'

const COPIED_MESSAGE_HIDE_TIMEOUT = 3000

export class EqCopyButton extends AbstractComponent<TemplateProps> {
  templateGetter = getTemplate
  css = css

  getTemplateProps(): TemplateProps {
    return {
      copiedMessage: this.getAttribute('copied-message'),
    }
  }

  static get observedAttributes() {
    return ['text', 'copied-message']
  }

  private currentTimeout: number | null = null
  private isMessageVisible = false

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('click', async () => {
      const text = this.getAttribute('text')

      if (text) {
        if (this.isMessageVisible) {
          this.toggleMessage(false)
        }

        await this.copyText(text)

        this.toggleMessage(true)

        this.currentTimeout = setTimeout(() => {
          this.toggleMessage(false)
        }, COPIED_MESSAGE_HIDE_TIMEOUT)
      }
    })
  }

  private async copyText(text: string) {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/plain': new Blob([text], {
          type: 'text/plain',
        }),
      }),
    ])
  }

  private toggleMessage(copied?: boolean) {
    if (this.isMessageVisible && this.currentTimeout) {
      clearTimeout(this.currentTimeout)
      this.currentTimeout = null
    }

    this.isMessageVisible = copied
    this.shadowRoot
      .querySelector('[part="copied"]')
      .toggleAttribute('data-visible', copied)
  }
}

customElements.define('eq-copy-button', EqCopyButton)
