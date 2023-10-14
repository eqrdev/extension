import puppeteer, { Browser, HTTPRequest, Page, Protocol } from 'puppeteer'
import { BrowserService } from './Types/BrowserService'

interface PuppeteerBrowserOptions {
  baseUrl?: string
  cookies?: Protocol.Network.CookieParam[]
  runInContainer?: boolean
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
      headless: 'new',
      args: this.options.runInContainer
        ? [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
          ]
        : [],
    })
    const page = await this.browser.newPage()
    await page.goto(this.options.baseUrl)
    await page.setCookie(...this.options.cookies)
    this.page = page
    return this.page
  }

  async goToPathName(pathName = ''): Promise<Page> {
    const page = await this.getPage()
    await page.goto(this.options.baseUrl + pathName)
    return page
  }

  async interceptRequest({ pathName = '', urlPattern }): Promise<HTTPRequest> {
    let returnRequest
    const page = await this.goToPathName(pathName)
    await page.setRequestInterception(true)
    await page.on('request', async request => {
      if (urlPattern.test(request.url())) {
        returnRequest = request
      }
      await request.continue()
    })
    await page.goto(this.options.baseUrl + pathName)
    return returnRequest
  }

  async interceptResponse<T>({ pathName = '', urlPattern }): Promise<T> {
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

  async runInSession(method: () => void): Promise<void> {
    const page = await this.getPage()
    await page.exposeFunction('method', method)
    await page.evaluate(async () => {
      await method()
    })
  }
}
