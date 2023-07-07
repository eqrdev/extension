import css from './Alert.css'
import getTemplate, { TemplateProps } from './Alert.html'
import { AbstractComponent } from '../AbstractComponent'

class EqAlert extends AbstractComponent<TemplateProps> {
  css = css

  templateGetter = getTemplate

  getTemplateProps(): TemplateProps {
    return {
      severity: this.severity,
      closable: this.closable,
      icon: this.icon,
    }
  }

  static get observedAttributes() {
    return ['severity', 'closable']
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
}

customElements.define('eq-alert', EqAlert)
