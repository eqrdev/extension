import Bottleneck from 'bottleneck'
import { scheduleJob } from 'node-schedule'

export class Scheduler {
  private limiter: Bottleneck

  constructor(
    private intervalInMillisecond: number
  ) {
    this.limiter = new Bottleneck({
      minTime: this.intervalInMillisecond,
      maxConcurrent: 1,
    })
  }

  schedule(task: () => Promise<void>): void {
    scheduleJob('*/10 * * * *', async () => {
      await this.limiter.schedule(async () => {
        await task()
      })
    })
  }
}