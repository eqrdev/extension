export interface DateEvaluatorInterface {
  isInTimeRange(timestamp: number, timeRange: number): boolean
  isWithinTwoWeeks(timestamp: number): boolean
}
