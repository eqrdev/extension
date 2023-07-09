export const pasteTextToElement = (
  text: string,
  element: HTMLElement
): void => {
  const dataTransfer = new DataTransfer()
  dataTransfer.setData('text/plain', text)

  element.dispatchEvent(
    new ClipboardEvent('paste', {
      clipboardData: dataTransfer,
      bubbles: false,
      cancelable: true,
    })
  )

  dataTransfer.clearData()
}
