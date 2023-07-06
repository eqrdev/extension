export class ChromeStorageGateway<T> {
  async get(): Promise<T> {
    return new Promise(resolve => {
      chrome.storage.sync.get(data => {
        resolve(data as T)
      })
    })
  }

  async set(data: T): Promise<void> {
    await chrome.storage.sync.set(data)
  }

  async setDefault(defaultData: Partial<T>): Promise<void> {
    chrome.storage.sync.get(defaultData, async data => {
      await chrome.storage.sync.set(data)
    })
  }
}
