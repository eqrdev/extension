customElements.define(
  'eq-input',
  class extends HTMLElement {
    static get observedAttributes() {
      return ['icon', 'placeholder']
    }

    get icon(): string {
      return this.getAttribute('icon')
    }

    focus() {
      this.shadowRoot.querySelector('input').focus()
    }

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      const template = document.createElement('template')
      template.innerHTML = `
        <style>
          .wrapper {
            display: flex;
            position: relative;
          }
          input {
            flex: 1;
            border-radius: 4px;
            border: 1px solid var(--eq-color-n200);
            background: var(--eq-color-white);
            padding: 12px 16px;
            line-height: 21px;
            font-size: 15px;
            font-family: var(--eq-font-primary), sans-serif;
          }
          input::placeholder {
            color: var(--eq-color-n200);
          }
        </style>
        <div class="wrapper">
          ${this.icon ? `<eq-icon type="${this.icon}"></eq-icon>` : ''}
          <input type="text" placeholder="${this.getAttribute(
            'placeholder'
          )}" />
        </div>
      `
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
  }
)
