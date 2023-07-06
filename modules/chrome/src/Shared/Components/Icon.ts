customElements.define(
  'eq-icon',
  class extends HTMLElement {
    static get observedAttributes() {
      return ['type', 'size']
    }

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.render()
    }

    render() {
      this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">
      <style>
        :host {
          display: inline-block;
          vertical-align: middle;
          height: ${this.getAttribute('size') || 24}px;
        }
      
        [part="icon"] {
          font-size: ${this.getAttribute('size') || 24}px;
          line-height: ${this.getAttribute('size') || 24}px;
        }
      </style>
      <span part="icon" class="material-symbols-outlined">${this.getAttribute(
        'type'
      )}</span>`
    }
  }
)
