import { LinkedInUrl, RouteName } from './LinkedInUrl'
import { ReactElement } from 'react'
import { createRoot, Root } from 'react-dom/client'

export interface ReactLoaderOptions {
  rootGetter: () => HTMLElement
  element: ReactElement
  routeName: RouteName
}

export class ReactAppLoader {
  routeName: RouteName
  rootGetter: () => HTMLElement
  element: ReactElement
  root: Root

  /**
   * @const BODY_LOADED_CLASS {string} This is a class that the body receives when LinkedIn is loaded.
   */
  private static readonly BODY_LOADED_CLASS = 'boot-complete'

  /** @const OBSERVED_ELEMENT {HTMLBodyElement} The element we observe for a change */
  private static readonly OBSERVED_ELEMENT = document.body

  /** @const REJECT_AFTER_DELAY {number} We throw an error after this timeout */
  private static readonly REJECT_AFTER_DELAY = 3000

  constructor({ rootGetter, element, routeName }: ReactLoaderOptions) {
    this.routeName = routeName
    this.rootGetter = rootGetter
    this.element = element
  }

  renderApp() {
    if (!this.root) {
      this.root = createRoot(this.rootGetter())
    }
    this.root.render(this.element)
  }

  async init() {
    if (LinkedInUrl.isOnRoute(this.routeName)) {
      await this.waitForLoad()
      this.renderApp()
    }

    chrome.runtime.onMessage.addListener(message => {
      if (message.type !== 'Navigate') return

      if (LinkedInUrl.isOnRoute(this.routeName)) {
        this.renderApp()
        return
      }

      if (this.root) {
        this.root.unmount()
        this.root = null
      }
    })
  }

  /**
   * LinkedIn shows a loading screen, and we have to
   * wait for disappear before we can take actions in
   * the rendered DOM.
   */
  async waitForLoad(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (
        ReactAppLoader.OBSERVED_ELEMENT.classList.contains(
          ReactAppLoader.BODY_LOADED_CLASS
        )
      ) {
        resolve()
      }

      const rejectTimeout = setTimeout(() => {
        reject()
      }, ReactAppLoader.REJECT_AFTER_DELAY)

      const callbackFunction = (
        node: HTMLElement,
        records: MutationRecord[]
      ) => {
        records.forEach(() => {
          if (node.classList.contains(ReactAppLoader.BODY_LOADED_CLASS)) {
            clearTimeout(rejectTimeout)
            resolve()
            observer.disconnect()
          }
        })
      }

      const observer = new MutationObserver(
        callbackFunction.bind(null, ReactAppLoader.OBSERVED_ELEMENT)
      )

      observer.observe(ReactAppLoader.OBSERVED_ELEMENT, {
        attributes: true,
        attributeFilter: ['class'],
      })
    })
  }
}
