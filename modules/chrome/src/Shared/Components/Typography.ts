customElements.define(
  'eq-typo',
  class extends HTMLElement {
    static get observedAttributes() {
      return ['small', 'link', 'bold', 'tag']
    }

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }

    get tag() {
      return this.getAttribute('tag') ?? 'div'
    }

    private get cssClasses() {
      return [
        ...(this.hasAttribute('small') ? ['small'] : []),
        ...(this.hasAttribute('bold') ? ['bold'] : []),
        ...(this.hasAttribute('link') ? ['link'] : []),
      ].join(' ')
    }

    connectedCallback() {
      this.shadowRoot.innerHTML = this.getTemplate()
    }

    private getTemplate() {
      return `
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700">
      <style>
        :host > slot {
          font-family: var(--eq-font-primary), sans-serif;
        }
        
        :not(.small) > slot {
          font-size: 15px;
          line-height: 21px;
        }
        
        :not(.bold) > slot {
          font-weight: 400;
        }
        
        .bold > slot {
          font-weight: 700;
        }
        
        .small > slot {
          font-size: 13px;
          line-height: 16px;
        }
        
        .link > slot {
          text-decoration: underline;
        }
      </style>
      <${this.tag} part="tag" class="${this.cssClasses}">
        <slot></slot>
      </${this.tag}>`
    }
  }
)

customElements.define(
  'eq-header',
  class extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }

    static get observedAttributes() {
      return ['level']
    }

    connectedCallback() {
      this.shadowRoot.innerHTML = this.getTemplate()
    }

    private get level() {
      if (!this.hasAttribute('level')) {
        return 1
      }

      const level = this.getAttribute('level')

      if (['1', '2', '3', '4'].includes(level)) {
        return Number(level)
      }

      return 1
    }

    private getTemplate() {
      return `
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700">
        <style>
          [part="header"] {
            font-family: var(--eq-font-primary), sans-serif;
          }
        
          .eq-typo-header1 {
            font-size: 34px;
            line-height: 38px;
            font-weight: 700;
          }
          
          .eq-typo-header2 {
            font-size: 28px;
            line-height: 32px;
            font-weight: 700;
          }
          
          .eq-typo-header3 {
            font-size: 24px;
            line-height: 28px;
            font-weight: 700;
          }
          
          .eq-typo-header4 {
            font-size: 20px;
            line-height: 25px;
            font-weight: 700;
          }
        </style>
        <h${this.level} part="header" class="eq-typo-header${this.level}">
          <slot></slot>
        </h${this.level}>
      `
    }
  }
)
