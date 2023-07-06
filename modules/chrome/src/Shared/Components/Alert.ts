customElements.define(
  'eq-alert',
  class extends HTMLElement {
    static get observedAttributes() {
      return ['severity', 'closable']
    }

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.render()
    }

    private isSeverity(value: string): value is 'info' | 'warning' | 'error' {
      return ['info', 'warning', 'error'].includes(value)
    }

    get severity(): 'info' | 'warning' | 'error' {
      const attribute = this.getAttribute('severity')
      if (this.hasAttribute('severity') && this.isSeverity(attribute)) {
        return attribute
      }

      return 'info'
    }

    get closable() {
      return this.hasAttribute('closable')
    }

    private get icon() {
      return {
        info: 'info',
        warning: 'error_outline',
        error: 'highlight_off',
      }[this.severity]
    }

    render() {
      this.shadowRoot.innerHTML = `
      <style>
        .wrapper {
          border-radius: 4px;
          padding: 16px;
          display: flex;
          gap: 12px;
        }
        
        .content {
          font-size: 15px;
          line-height: 21px;
        }
        
        .error {
          background: var(--eq-color-e300);
          color: var(--eq-color-white);
        }
        
        .alert {
          background: var(--eq-color-w300);
          color: var(--eq-color-white);
        }
        
        .info {
          background: var(--eq-color-n100);
          color: var(--eq-color-n400);
        }
      </style>
      <div class="wrapper ${this.severity}">
        <eq-icon type="${this.icon}"></eq-icon>
        <div class="content">
          <slot></slot>
        </div>
        ${this.closable ? '<eq-icon type="close"></eq-icon>' : ''}
      </div>
    `
    }
  }
)
