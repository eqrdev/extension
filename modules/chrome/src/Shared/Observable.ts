type CallbackFunction<T, U = unknown> = (value: T) => U

export class Observable<T> {
  #value: T

  private observers: Array<CallbackFunction<T>> = []

  constructor(initialValue: T) {
    this.#value = initialValue
  }

  set value(newValue: T) {
    this.#value = newValue
    this.notify()
  }

  get value() {
    return this.#value
  }

  subscribe(callback: CallbackFunction<T>) {
    this.observers.push(callback)
  }

  notify() {
    this.observers.forEach(observer => {
      observer(this.#value)
    })
  }
}
