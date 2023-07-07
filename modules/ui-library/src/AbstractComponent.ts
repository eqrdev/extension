export abstract class AbstractComponent<
  T extends Record<string, any>
> extends HTMLElement {
  protected css = ''

  abstract templateGetter: (templateProps: T) => string

  abstract getTemplateProps(): T

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  protected render(): void {
    const template = document.createElement('template')
    template.innerHTML = this.css + this.templateGetter(this.getTemplateProps())
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  protected get $ui(): Record<string, HTMLElement> {
    return Array.from(
      this.shadowRoot?.querySelectorAll<HTMLElement>('[data-js]')
    ).reduce(
      (map, element) => ({
        ...map,
        [element.dataset.jsControl]: element,
      }),
      {}
    )
  }
}
