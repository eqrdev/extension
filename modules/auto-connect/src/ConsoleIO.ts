export class ConsoleIO {
  headline(message: string) {
    console.clear()
    console.log(`\x1b[36m\x1b[4m${message}\x1b[0m`)
  }

  write(message: string) {
    console.log(message)
  }

  waitForKey(keyCode: number): Promise<boolean> {
    return new Promise(resolve => {
      process.stdin.on('data', function (chunk) {
        if (chunk[0] === keyCode) {
          resolve(true)
          process.stdin.pause()
        }
      })
    })
  }
}
