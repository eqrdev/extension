export abstract class ContentElement<T extends HTMLElement> {
  abstract id: string

  private isInDom(): boolean {
    return !!document.querySelector(`[data-id="${this.id}"]`)
  }

  private internalCreate(): T {
    const element = this.create()
    element.dataset.id = this.id
    return element
  }

  public inject(): void {
    if (this.isInDom()) {
      return
    }
    const element = this.internalCreate()
    this.injectorMethod(element)
    this.injectedCallback(element)
  }

  protected abstract create(): T

  protected abstract injectedCallback?(element: T): void

  protected abstract injectorMethod(element: T): void
}
