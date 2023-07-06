customElements.define(
  'eq-textarea',
  class extends HTMLElement {
    static get observedAttributes() {
      return ['value', 'maxLength', 'info']
    }

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.render()
    }

    focus() {
      this.shadowRoot.querySelector('textarea').focus()
    }

    connectedCallback() {
      const input = this.shadowRoot.querySelector('textarea')
      this.updateCharacterCounter((input as HTMLTextAreaElement).value)

      input.style.height = `${input.scrollHeight + 4}px`
      input.addEventListener(
        'input',
        event => {
          input.style.height = 'auto'
          input.style.height = `${input.scrollHeight + 4}px`
          this.updateCharacterCounter(
            (event.target as HTMLTextAreaElement).value
          )
        },
        false
      )
    }

    private updateCharacterCounter(newValue: string) {
      const element =
        this.shadowRoot.querySelector<HTMLElement>('.character-counter')
      element.innerText = `${newValue.length}/${this.getAttribute('maxLength')}`
    }

    getCharacterCountString() {
      return `${this.value.length}/${this.getAttribute('maxLength')}`
    }

    get value() {
      if (!this.hasAttribute('value')) {
        return ''
      }

      return this.getAttribute('value')
    }

    render() {
      this.shadowRoot.innerHTML = this.getTemplate()
    }

    getTemplate() {
      return `
        <style>
          :host {
            display: flex;
            width: 100%;
            min-width: 600px;
          }
          @media (max-width: 660px) {
            :host {
              min-width: 100%;
            }
          }
          .wrapper {
            width: 100%;
          }
          textarea {
            flex: 1;
            border-radius: 4px;
            border: 1px solid var(--eq-color-n200);
            background: var(--eq-color-white);
            padding: 12px 16px 8px;
            line-height: 20px;
            font-size: 15px;
            font-family: var(--eq-font-primary), sans-serif;
            resize: vertical;
            width: 100%;
            box-sizing: border-box;
          }
          input::placeholder {
            color: var(--eq-color-n200);
          }
          .meta {
            display: flex;
            justify-content: space-between;
            color: var(--eq-color-n300);
          }
        </style>
        <div class="wrapper">
          <textarea
            rows="4"
            maxlength="${this.getAttribute('maxLength')}">${
        this.value
      }</textarea>
          <div class="meta">
            <eq-typo small class="url-info">${this.getAttribute(
              'info'
            )}</eq-typo>
            <eq-typo small class="character-counter">${this.getCharacterCountString()}</eq-typo>
          </div>
        </div>
      `
    }
  }
)
