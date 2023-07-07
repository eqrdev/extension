import { AbstractComponent } from '../AbstractComponent'
import { typographyCss, headerCss } from './Typography.css'
import {
  getHeaderTemplate,
  getTypoTemplate,
  HeaderTemplateProps,
  TypoTemplateProps,
} from './Typography.html'

class EqTypography extends AbstractComponent<TypoTemplateProps> {
  css = typographyCss
  templateGetter = getTypoTemplate

  getTemplateProps(): TypoTemplateProps {
    return {
      tag: this.tag,
      classes: this.cssClasses,
    }
  }

  static get observedAttributes() {
    return ['small', 'link', 'bold', 'tag']
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
}

class EqHeader extends AbstractComponent<HeaderTemplateProps> {
  css = headerCss
  templateGetter = getHeaderTemplate

  getTemplateProps(): HeaderTemplateProps {
    return {
      level: this.level,
    }
  }

  static get observedAttributes() {
    return ['level']
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
}

customElements.define('eq-header', EqHeader)
customElements.define('eq-typo', EqTypography)
