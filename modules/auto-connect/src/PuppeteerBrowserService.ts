import puppeteer, { Browser, HTTPRequest, Page, Protocol } from 'puppeteer'
import { BrowserService } from './Types/BrowserService'

interface PuppeteerBrowserOptions {
  baseUrl?: string
  cookies?: Protocol.Network.CookieParam[]
  noHeadlessRun?: boolean
}

export class PuppeteerBrowserService
  implements BrowserService<Page, HTTPRequest>
{
  page: Page = null
  browser: Browser

  constructor(private options: PuppeteerBrowserOptions) {}

  async getPage(): Promise<Page> {
    if (this.page !== null) {
      return this.page
    }

    this.browser = await puppeteer.launch({
      executablePath:
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: this.options.noHeadlessRun ? false : 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
      ],
    })
    const page = await this.browser.newPage()
    await page.goto(this.options.baseUrl)
    await page.setCookie(...this.options.cookies)
    this.page = page
    return this.page
  }

  async goToPathName(pathName = ''): Promise<Page> {
    const page = await this.getPage()
    await page.goto(this.options.baseUrl + pathName, {
      timeout: 60_000,
    })
    return page
  }

  async interceptRequest({ pathName = '', urlPattern }: { pathName: string, urlPattern: RegExp }): Promise<HTTPRequest> {
    let returnRequest: HTTPRequest
    const page = await this.goToPathName(pathName)
    await page.setRequestInterception(true)
    page.on('request', async request => {
      if (urlPattern.test(request.url())) {
        returnRequest = request
      }
      await request.continue()
    })
    await page.goto(this.options.baseUrl + pathName)
    return returnRequest
  }

  async interceptResponse<T>({ pathName = '', urlPattern }: { pathName: string, urlPattern: RegExp }): Promise<T> {
    const page = await this.goToPathName(pathName)
    const response = await page.waitForResponse(response =>
      urlPattern.test(response.url())
    )
    return await response.json()
  }

  async getCookie(name: string): Promise<string | undefined> {
    const page = await this.getPage()
    const cookies = await page.cookies(this.options.baseUrl)
    return cookies.find(({ name: cookieName }) => cookieName === name)?.value
  }

  async runInSession<T>(method: () => T): Promise<T> {
    const page = await this.getPage()
    await page.exposeFunction('method', method)
    return page.evaluate(async () => {
      return method()
    })
  }
}
