import {
  ChromeMessageGateway,
  MessageType,
} from '../Shared/ChromeMessageGateway'
import { RouteName } from './LinkedInUrl'

/** @const This is a class that the body receives when LinkedIn is loaded. */
const BODY_LOADED_CLASS = 'boot-complete'

/** @const The element we observe for a change */
const OBSERVED_ELEMENT = document.body

/** @const We throw an error after this timeout */
const REJECT_AFTER_DELAY = 3000

interface DomInjectorConfig {
  parentSelector: string
  element: HTMLElement
  messageType?: MessageType | MessageType[]
  routeName?: RouteName
  callback?: (element: HTMLElement) => void
}

export class DomInjector {
  private injected = false
  private messageGateway = new ChromeMessageGateway(false)
  private config: DomInjectorConfig

  constructor(config: DomInjectorConfig) {
    this.config = config
    this.injectAfterConditionsMet().then(() => {
      this.injected = true
    })
  }

  public inject() {
    document
      .querySelector(this.config.parentSelector)
      .appendChild(this.config.element)
    this.config.callback?.(this.config.element)
  }

  private async injectAfterConditionsMet() {
    if (this.injected) {
      return
    }

    await this.setupMessages()
  }

  private async injectWhenLoaded(): Promise<void> {
    await Promise.all([this.setupDom(), this.waitForLinkedinLoad()])

    this.inject()
  }

  private async setupMessages(): Promise<void> {
    if (!this.config.messageType) {
      return
    }

    const messageTypes =
      typeof this.config.messageType === 'string'
        ? [this.config.messageType]
        : this.config.messageType

    messageTypes.map(messageType =>
      this.messageGateway.on(messageType, this.injectWhenLoaded.bind(this))
    )
  }

  private async setupDom(): Promise<void> {
    return new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', () => {
        resolve()
      })
    })
  }

  /**
   * LinkedIn shows a loading screen, and we have to
   * wait for disappear before we can take actions in
   * the rendered DOM.
   */
  private async waitForLinkedinLoad(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (OBSERVED_ELEMENT.classList.contains(BODY_LOADED_CLASS)) {
        resolve()
      }

      const rejectTimeout = setTimeout(() => {
        reject()
      }, REJECT_AFTER_DELAY)

      const callbackFunction = (
        node: HTMLElement,
        records: MutationRecord[]
      ) => {
        records.forEach(() => {
          if (node.classList.contains(BODY_LOADED_CLASS)) {
            clearTimeout(rejectTimeout)
            resolve()
          }
        })
      }

      const observer = new MutationObserver(
        callbackFunction.bind(null, OBSERVED_ELEMENT)
      )

      observer.observe(OBSERVED_ELEMENT, {
        attributes: true,
        attributeFilter: ['class'],
      })
    })
  }
}
