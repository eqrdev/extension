import { EqButton } from '../Button/Button'
import css from './IconButton.css'

class EqIconButton extends EqButton {
  connectedCallback() {
    super.connectedCallback()
    const template = document.createElement('template')
    template.innerHTML = css
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('eq-icon-button', EqIconButton)
