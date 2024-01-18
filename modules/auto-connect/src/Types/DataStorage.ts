export interface DataStorage<T> {
  save(data: T): Promise<void>
  read(): Promise<T>
  hasFile(): Promise<boolean>
}
