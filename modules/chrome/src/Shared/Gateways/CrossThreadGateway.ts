export class CrossThreadGateway {
  addProfileName() {
    chrome.runtime.sendMessage({ type: 'AddProfileName' })
  }

  openSettings() {
    chrome.runtime.sendMessage({ type: 'OpenSettings' })
  }
}
