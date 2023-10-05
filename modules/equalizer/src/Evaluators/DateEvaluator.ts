export interface DateProvider {
  now(): number
}

const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000

export class DateEvaluator {
  private static DefaultTimeRange = TWO_WEEKS

  constructor(private dateProvider: DateProvider) {}

  isInTimeRange(timestamp: number, timeRange: number) {
    const now = this.dateProvider.now()

    if (timestamp > now) {
      throw new RangeError(
        `The given date ${new Date(
          timestamp
        ).toDateString()} is later than the current date. An earlier date must be provided.`
      )
    }

    return timestamp >= now - timeRange
  }

  isWithinTwoWeeks(timestamp: number) {
    return this.isInTimeRange(timestamp, DateEvaluator.DefaultTimeRange)
  }
}
