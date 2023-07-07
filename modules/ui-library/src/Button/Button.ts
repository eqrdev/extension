import { AbstractComponent } from '../AbstractComponent'
import getTemplate, { TemplateProps } from './Button.html'
import css from './Button.css'

export class EqButton extends AbstractComponent<TemplateProps> {
  templateGetter = getTemplate
  css = css

  getTemplateProps(): TemplateProps {
    return {
      icon: this.#icon,
      classes: this.#cssClasses,
    }
  }

  static get observedAttributes() {
    return ['icon', 'outline', 'size']
  }

  private qualifiedSizes = ['large', 'small']

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
}

customElements.define('eq-button', EqButton)
