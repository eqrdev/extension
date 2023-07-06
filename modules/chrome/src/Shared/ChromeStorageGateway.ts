export class ChromeStorageGateway<T> {
  async getAll(): Promise<T> {
    return new Promise(resolve => {
      chrome.storage.sync.get(data => {
        resolve(data as T)
      })
    })
  }

  async get(key: keyof T): Promise<T[keyof T]> {
    return (await this.getAll())[key]
  }

  async set(data: T): Promise<void> {
    await chrome.storage.sync.set(data)
  }
}
