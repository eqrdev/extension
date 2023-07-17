/** @const This is a class that the body receives when LinkedIn is loaded. */
const BODY_LOADED_CLASS = 'boot-complete'

/** @const The element we observe for a change */
const OBSERVED_ELEMENT = document.body

/** @const We throw an error after this timeout */
const REJECT_AFTER_DELAY = 3000

/**
 * LinkedIn shows a loading screen, and we have to
 * wait for disappear before we can take actions in
 * the rendered DOM.
 */
export const waitForLinkedinLoad = async (): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    if (OBSERVED_ELEMENT.classList.contains(BODY_LOADED_CLASS)) {
      resolve()
    }

    const rejectTimeout = setTimeout(() => {
      reject()
    }, REJECT_AFTER_DELAY)

    const callbackFunction = (node: HTMLElement, records: MutationRecord[]) => {
      records.forEach(() => {
        if (node.classList.contains(BODY_LOADED_CLASS)) {
          clearTimeout(rejectTimeout)
          resolve()
          observer.disconnect()
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
