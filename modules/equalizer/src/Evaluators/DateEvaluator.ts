export interface DateProvider {
  now(): number
}

const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000

export class DateEvaluator {
  private static DefaultTimeRange = TWO_WEEKS

  constructor(private dateProvider: DateProvider) {}

  isInTimeRange(timestamp: number, timeRange: number) {
    const now = this.dateProvider.now()
    return timestamp >= now - timeRange
  }

  isWithinTwoWeeks(timestamp: number) {
    return this.isInTimeRange(timestamp, DateEvaluator.DefaultTimeRange)
  }
}
