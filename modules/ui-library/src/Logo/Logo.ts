import { AbstractComponent } from '../AbstractComponent'
import css from './Logo.css'
import getTemplate, { TemplateProps } from './Logo.html'

export class EqLogo extends AbstractComponent<TemplateProps> {
  css = css
  templateGetter = getTemplate

  getTemplateProps(): TemplateProps {
    return {
      size: this.getAttribute('size'),
      inverse: this.inverse,
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.setProperty('--icon-size', `${this.iconSize}px`)
    this.style.setProperty('--logo-size', `${this.size}px`)
  }

  static get observedAttributes() {
    return ['inverse', 'size']
  }

  get inverse(): boolean {
    return this.hasAttribute('inverse')
  }

  get size() {
    const DEFAULT_SIZE = 32

    return this.hasAttribute('size')
      ? Number(this.getAttribute('size'))
      : DEFAULT_SIZE
  }

  get iconSize() {
    return (this.size / 4) * 3
  }
}

customElements.define('eq-logo', EqLogo)
