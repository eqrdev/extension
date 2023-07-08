export class ChromeStorageGateway<T> {
  async getAll(): Promise<T> {
    return new Promise(resolve => {
      chrome.storage.sync.get(data => {
        resolve(data as T)
      })
    })
  }

  async get(key: Extract<keyof T, string>): Promise<T[keyof T]> {
    return (await this.getAll())[key]
  }

  async set(data: Partial<T> | T): Promise<void> {
    await chrome.storage.sync.set(data)
  }

  async remove(key: Extract<keyof T, string>): Promise<void> {
    await chrome.storage.sync.remove(key)
  }
}
