export interface BrowserService<Page = void, HTTPRequest = void> {
  page: Page
  getPage(): Promise<Page>
  goToPathName(pathName?: string): Promise<Page>
  interceptRequest(opts: {
    pathName: string
    urlPattern: RegExp
  }): Promise<HTTPRequest>
  interceptResponse<T>(opts: {
    pathName: string
    urlPattern: RegExp
  }): Promise<T>
  getCookie(name: string): Promise<string | undefined>
}
