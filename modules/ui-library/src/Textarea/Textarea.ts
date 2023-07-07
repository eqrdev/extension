import css from './Textarea.css'
import getTemplate, { TemplateProps } from './Textarea.html'
import { AbstractComponent } from '../AbstractComponent'

class EqTextarea extends AbstractComponent<TemplateProps> {
  templateGetter = getTemplate
  css = css

  getTemplateProps(): TemplateProps {
    return {
      value: this.getAttribute('value'),
      maxLength: Number(this.getAttribute('maxLength')),
      info: this.getAttribute('info'),
      characterCount: this.getCharacterCountString(),
    }
  }

  static get observedAttributes() {
    return ['value', 'maxLength', 'info']
  }

  focus() {
    this.shadowRoot.querySelector('textarea').focus()
  }

  connectedCallback() {
    const input = this.shadowRoot.querySelector('textarea')
    this.updateCharacterCounter((input as HTMLTextAreaElement).value)

    input.style.height = `${input.scrollHeight + 4}px`
    input.addEventListener(
      'input',
      event => {
        input.style.height = 'auto'
        input.style.height = `${input.scrollHeight + 4}px`
        this.updateCharacterCounter((event.target as HTMLTextAreaElement).value)
      },
      false
    )
  }

  private updateCharacterCounter(newValue: string) {
    const element =
      this.shadowRoot.querySelector<HTMLElement>('.character-counter')
    element.innerText = `${newValue.length}/${this.getAttribute('maxLength')}`
  }

  getCharacterCountString() {
    return `${this.value.length}/${this.getAttribute('maxLength')}`
  }

  get value() {
    if (!this.hasAttribute('value')) {
      return ''
    }

    return this.getAttribute('value')
  }
}

customElements.define('eq-textarea', EqTextarea)
