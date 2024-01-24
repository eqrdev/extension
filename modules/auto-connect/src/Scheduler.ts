import { Logger } from './Logger'

export class Scheduler {
  constructor(
    private intervalInMillisecond: number,
    private logger?: Logger,
    private unsuccessfulConsecutiveRuns = 0,
  ) {}

  static UNSUCCESSFUL_RUNS = 3

  schedule(task: () => Promise<void>): void {
    if (this.unsuccessfulConsecutiveRuns >= Scheduler.UNSUCCESSFUL_RUNS) {
      throw new Error(
        `We ran the monitoring ${Scheduler.UNSUCCESSFUL_RUNS} times, each time unsuccessfully, exiting.`,
      )
    }

    try {
      this.logger.log('Scheduled task starting')
      task().then(() => {
        this.logger.log(
          `Task ran successfully, next schedule starts in ${this.intervalInMillisecond / 1000} seconds`,
        )
        setTimeout(() => {
          this.schedule(task)
        }, this.intervalInMillisecond)
        this.unsuccessfulConsecutiveRuns = 0
      })
    } catch (e) {
      this.logger.log(`Unsuccessful run.`)
      this.unsuccessfulConsecutiveRuns++
    }
  }
}
