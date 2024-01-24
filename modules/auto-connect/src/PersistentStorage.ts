export interface PersistentStorage<T> {
  isEmpty(): boolean
  save(data: T): void
  read(): T
}
