export abstract class BaseWebComponent extends HTMLElement {
  templateElement: HTMLTemplateElement

  private isListenersAdded = false

  abstract getTemplate(): string

  constructor() {
    super()
    this.templateElement = document.createElement('template')
  }

  protected __(message: string) {
    return chrome.i18n.getMessage(message)
  }

  protected get $ui(): Record<string, Element> {
    return Array.from(
      this.querySelectorAll<HTMLElement>('[data-js-control]')
    ).reduce(
      (map, element) => ({
        ...map,
        [element.dataset.jsControl]: element,
      }),
      {}
    )
  }

  public connectedCallback() {
    this.render()
  }

  protected addListeners?(): void

  protected afterRender?(): void

  protected render() {
    this.templateElement.innerHTML = this.getTemplate()
    const mounting = this.shadowRoot ?? this
    mounting.replaceChildren(this.templateElement.content.cloneNode(true))
    this.afterRender?.()
    if (this.isListenersAdded) return
    this.addListeners?.()
    this.isListenersAdded = true
  }
}
