const CHECKED_ATTR = 'checked'
const DISABLED_ATTR = 'disabled'

customElements.define(
  'eq-switch',
  class extends HTMLElement {
    static get observedAttributes() {
      return [CHECKED_ATTR, 'label', 'labelEnabled']
    }

    static formAssociated = true

    constructor() {
      super()
      this.attachShadow({ mode: 'open' }).appendChild(
        this.getTemplate().content.cloneNode(true)
      )
    }

    getTemplate() {
      const template = document.createElement('template')
      template.innerHTML = `
        <style>
          :host {
            outline: 0;
            border-radius: 40px;
          }
        
          [part="track"] {
            width: 48px;
            height: 24px;
            flex-shrink: 0;
            border-radius: 40px;
            border: 1px solid var(--eq-color-n200);
            background: var(--eq-color-white);
            position: relative;
            transition: background .3s ease;
            outline: 0;
          }
          
          [part="slider"] {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
            border-radius: 16px;
            background: var(--eq-color-n300);
            position: absolute;
            top: 0;
            left: 0;
            margin: 4px;
            outline: 0;
            transition:
              transform .3s ease,
              background .3s ease;
          }
          
          :host(:focus) {
            box-shadow: 0 0 0 2px rgba(39, 39, 39, 0.4);
          }
          
          :host([checked]) [part="track"] {
            background: var(--eq-color-s300);
          }
          
          :host [part="track"]::before {
            content: attr(label);
            position: absolute;
            right: calc(100% + 8px);
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
          }
          
          :host([checked]) [part="track"]::before {
            content: attr(labelEnabled);
          }
          
          :host([checked]) [part="slider"] {
            background: var(--eq-color-white);
            transform: translateX(24px);
          }
        </style>
      
        <div part="track" label="${this.getAttribute(
          'label'
        )}" labelEnabled="${this.getAttribute('labelEnabled')}">
          <div part="slider"></div>
        </div>`
      return template
    }

    connectedCallback() {
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'switch')
      }

      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', '0')
      }

      this.updateChecked(false)

      this.addEventListener('click', this.toggle)
      this.addEventListener('keydown', this.onKeyDown)
    }

    disconnectedCallback() {
      this.removeEventListener('click', this.toggle)
      this.removeEventListener('keydown', this.onKeyDown)
    }

    attributeChangedCallback(name) {
      if (name === CHECKED_ATTR) {
        this.updateChecked(true)
      }
    }

    get checked() {
      return this.hasAttribute(CHECKED_ATTR)
    }

    set checked(value) {
      this.toggleAttribute(CHECKED_ATTR, value)
    }

    get disabled() {
      return this.hasAttribute(DISABLED_ATTR)
    }
    set disabled(value) {
      this.toggleAttribute(DISABLED_ATTR, value)
    }

    toggle() {
      if (!this.disabled) {
        this.checked = !this.checked
      }
    }

    private onKeyDown = e => {
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault()
          this.toggle()
          break
        default:
          break
      }
    }

    private updateChecked(dispatch = false) {
      this.setAttribute('aria-checked', this.checked.toString())
      if (dispatch) {
        this.dispatchEvent(
          new CustomEvent('switch:checked', {
            detail: { checked: this.checked },
          })
        )
      }
    }
  }
)
