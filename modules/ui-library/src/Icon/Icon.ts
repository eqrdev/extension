import { AbstractComponent } from '../AbstractComponent'
import { TemplateProps } from './Icon.html'
import getTemplate from './Icon.html'
import css from './Icon.css'

export class EqIcon extends AbstractComponent<TemplateProps> {
  templateGetter = getTemplate
  css = css

  connectedCallback() {
    super.connectedCallback()
    this.style.setProperty('--icon-size', `${this.size}px`)
  }

  getTemplateProps(): TemplateProps {
    return {
      type: this.getAttribute('type'),
    }
  }

  static get observedAttributes() {
    return ['type', 'size']
  }

  get size() {
    return this.getAttribute('size') || 24
  }
}

customElements.define('eq-icon', EqIcon)
