export class Scheduler {
  constructor(
    private intervalInMillisecond: number,
    private unsuccessfulConsecutiveRuns = 0
  ) {}

  static UNSUCCESSFUL_RUNS = 3

  schedule(task: () => Promise<void>): void {
    if (this.unsuccessfulConsecutiveRuns >= Scheduler.UNSUCCESSFUL_RUNS) {
      throw new Error(
        `We ran the monitoring ${Scheduler.UNSUCCESSFUL_RUNS} times, each time unsuccessfully, exiting.`
      )
    }

    try {
      task().then(() => {
        setTimeout(() => {
          this.schedule(task)
        }, this.intervalInMillisecond)
        this.unsuccessfulConsecutiveRuns = 0
      })
    } catch (e) {
      this.unsuccessfulConsecutiveRuns++
    }
  }
}
