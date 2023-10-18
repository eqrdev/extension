export class DateTimeGateway {
  now(): number {
    return Date.now()
  }

  setTimeout(callback, timeout) {
    return setTimeout(callback, timeout)
  }
}
