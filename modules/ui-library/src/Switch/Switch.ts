import { AbstractComponent } from '../AbstractComponent'
import getTemplate, { TemplateProps } from './Switch.html'
import css from './Switch.css'

const CHECKED_ATTR = 'checked'
const DISABLED_ATTR = 'disabled'

class EqSwitch extends AbstractComponent<TemplateProps> {
  templateGetter = getTemplate
  css = css

  getTemplateProps(): TemplateProps {
    return {
      label: this.getAttribute('label'),
      labelEnabled: this.getAttribute('labelEnabled'),
    }
  }

  static get observedAttributes() {
    return [CHECKED_ATTR, 'label', 'labelEnabled']
  }

  static formAssociated = true

  connectedCallback() {
    super.connectedCallback()
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'switch')
    }

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0')
    }

    this.updateChecked(false)

    this.addEventListener('click', this.toggle)
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.toggle)
    this.removeEventListener('keydown', this.onKeyDown)
  }

  attributeChangedCallback(name) {
    if (name === CHECKED_ATTR) {
      this.updateChecked(true)
    }
  }

  get checked() {
    return this.hasAttribute(CHECKED_ATTR)
  }

  set checked(value) {
    this.toggleAttribute(CHECKED_ATTR, value)
  }

  get disabled() {
    return this.hasAttribute(DISABLED_ATTR)
  }
  set disabled(value) {
    this.toggleAttribute(DISABLED_ATTR, value)
  }

  toggle() {
    if (!this.disabled) {
      this.checked = !this.checked
    }
  }

  private onKeyDown = e => {
    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault()
        this.toggle()
        break
      default:
        break
    }
  }

  private updateChecked(dispatch = false) {
    this.setAttribute('aria-checked', this.checked.toString())
    if (dispatch) {
      this.dispatchEvent(
        new CustomEvent('switch:checked', {
          detail: { checked: this.checked },
        })
      )
    }
  }
}

customElements.define('eq-switch', EqSwitch)
