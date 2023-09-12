export class DateTimeGateway {
  now(): Date {
    return new Date(Date.now())
  }

  setTimeout(callback, timeout) {
    return setTimeout(callback, timeout)
  }
}
