export class Button extends HTMLElement {
  static get observedAttributes() {
    return ['icon', 'outline', 'size']
  }

  private qualifiedSizes = ['large', 'small']

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  handleSlotContentChange = mutationsList => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === 'childList' &&
        mutation.target === this.shadowRoot.querySelector('slot')
      ) {
        console.log(this.hasSlotContent())

        this.querySelector('button').classList[
          this.hasSlotContent() ? 'remove' : 'add'
        ]('icon-only')
      }
    }
  }

  hasSlotContent() {
    const slot = this.shadowRoot.querySelector('slot')
    return slot.assignedNodes().length > 0
  }

  connectedCallback() {
    this.render()
    const observer = new MutationObserver(this.handleSlotContentChange)
    observer.observe(this.shadowRoot.querySelector('slot'), {
      childList: true,
    })
  }

  get #icon() {
    return this.getAttribute('icon')
  }

  get #size() {
    const attribute = this.getAttribute('size')

    if (attribute) {
      if (this.qualifiedSizes.includes(attribute)) {
        return attribute
      }
    }

    return 'size-default'
  }

  get #style() {
    return this.hasAttribute('outline') ? 'outline' : 'style-default'
  }

  get #cssClasses() {
    const classList = ['button', this.#size, this.#style]
    if (this.hasAttribute('outline')) {
      classList.push('outline')
    }

    return classList.join(' ')
  }

  render() {
    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap">
    <style>
      .button {
        border: 0;
        border-radius: 4px;
        font-family: var(--eq-font-secondary), sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: stretch;
        white-space: nowrap;
        outline: 0;
        gap: 12px;
        transition:
          background .2s ease,
          box-shadow .2s ease;
      }
      
      .style-default {
        background: var(--eq-color-n500);
        color: var(--eq-color-white);
      }
      
      .style-default:hover {
        background: var(--eq-color-n400);
      }
      
      .style-default:active {
        background: rgba(39, 39, 39, 0.80);
      }
      
      .button:focus {
        box-shadow: 0 0 0 2px rgba(39, 39, 39, 0.4);
      }
      
      .size-default {
        height: 48px;
        padding: 9px 16px;
      }
      
      .large {
        height: 56px;
        padding: 16px 24px;
      }
      
      .small {
        height: 32px;
        padding: 7px 12px;
      }
      
      .outline {
        background: var(--eq-color-white);
        box-shadow: inset 0 0 2px 0 var(--eq-color-n500);
      }
      
      .outline:hover {
        background: var(--eq-color-n200);
      }
      
      .outline:active {
        background: var(--eq-color-n500);
      }
      
      .button:disabled {
        background: var(--eq-color-n200);
        color: var(--eq-color-n300);
      }
      
      .icon-only {
        border-radius: 100%;
        height: 48px;
        width: 48px;
        padding: 4px;
        box-sizing: border-box;
      }
      
      [part="icon"] {
        line-height: 24px;
        height: 24px;
      }
    </style>
    <button part="wrapper" class="${this.#cssClasses}">
      ${
        this.hasAttribute('icon') &&
        `<eq-icon part="icon" type="${this.#icon}"></eq-icon>`
      }
      <slot></slot>
    </button>`
  }
}

customElements.define('eq-button', Button)
