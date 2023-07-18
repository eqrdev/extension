export class ChromeStorageGateway<T> {
  sessionOnly: boolean = false

  constructor(
    { sessionOnly }: { sessionOnly?: boolean } = { sessionOnly: false }
  ) {
    this.sessionOnly = sessionOnly
  }

  private get storage(): chrome.storage.StorageArea {
    return chrome.storage[this.sessionOnly ? 'session' : 'sync']
  }

  async getAll(): Promise<T> {
    return new Promise(resolve => {
      this.storage.get(data => {
        resolve(data as T)
      })
    })
  }

  async get(key: Extract<keyof T, string>): Promise<T[keyof T]> {
    return (await this.getAll())[key]
  }

  async set(data: Partial<T> | T): Promise<void> {
    await this.storage.set(data)
  }

  async remove(key: Extract<keyof T, string>): Promise<void> {
    await this.storage.remove(key)
  }
}
