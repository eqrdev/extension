import { AbstractComponent } from '../AbstractComponent'
import getTemplate, { TemplateProps } from './Input.html'
import css from './Input.css'

class EqInput extends AbstractComponent<TemplateProps> {
  templateGetter = getTemplate
  css = css

  getTemplateProps(): TemplateProps {
    return {
      icon: this.icon,
      value: this.getAttribute('value'),
      placeholder: this.getAttribute('placeholder'),
    }
  }

  static get observedAttributes() {
    return ['icon', 'placeholder', 'value']
  }

  get icon(): string {
    return this.getAttribute('icon')
  }

  get value() {
    return this.shadowRoot.querySelector('input').value
  }

  set value(value: string) {
    this.shadowRoot.querySelector('input').value = value
  }

  focus() {
    this.shadowRoot.querySelector('input').focus()
  }
}

customElements.define('eq-input', EqInput)
