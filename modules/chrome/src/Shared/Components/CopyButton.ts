const COPIED_MESSAGE_HIDE_TIMEOUT = 3000

customElements.define(
  'eq-copy-button',
  class extends HTMLElement {
    static get observedAttributes() {
      return ['text', 'copied-message']
    }

    private currentTimeout: number | null = null
    private isMessageVisible = false

    connectedCallback() {
      const template = document.createElement('template')
      template.innerHTML = this.getTemplate()
      this.attachShadow({ mode: 'open' }).appendChild(
        template.content.cloneNode(true)
      )

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

    private getTemplate() {
      return `
      <style>
        [part="button"] {
          position: relative;
        }
      
        [part="copied"] {
          opacity: 0;
          visibility: hidden;
          translate: 16px 0;
          pointer-events: none;
          display: flex;
          padding: 4px 6px;
          align-items: center;
          gap: 4px;
          border-radius: 4px;
          background: var(--eq-color-s300);
          color: var(--eq-color-white);
          font-size: 13px;
          font-family: var(--eq-font-primary);
          font-style: normal;
          font-weight: 400;
          line-height: 16px;
          position: absolute;
          right: calc(100% + 4px);
          transition:
            visibility .1s ease,
            translate .1s ease,
            opacity .1s ease;
        }
        
        [part="copied"] eq-icon {
          display: flex;
        }
        
        [part="copied"][data-visible] {
          opacity: 1;
          visibility: visible;
          translate: 0 0;
        }
      </style>
      <eq-icon-button part="button" icon="content_copy">
        <span part="copied">
          <eq-icon size="16" type="check_circle_outline"></eq-icon>
          <span>${this.getAttribute('copied-message')}</span>
        </span>
      </eq-icon-button>
    `
    }
  }
)
