customElements.define(
  'eq-logo',
  class extends HTMLElement {
    static get observedAttributes() {
      return ['inverse', 'size']
    }

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.render()
    }

    get inverse(): boolean {
      return this.hasAttribute('inverse')
    }

    get size() {
      const DEFAULT_SIZE = 32

      return this.hasAttribute('size')
        ? this.getAttribute('size')
        : DEFAULT_SIZE
    }

    render() {
      this.shadowRoot.innerHTML = `
      <style>
        eq-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${this.inverse ? 'var(--eq-color-n500)' : 'transparent'};
          color: ${
            this.inverse ? 'var(--eq-color-white)' : 'var(--eq-color-n500)'
          };
          width: ${this.size}px;
          height: ${this.size}px;
          font-size: ${this.size}px;
        }
      </style>
      <eq-icon type="equalizer"></eq-icon>
    `
    }
  }
)
