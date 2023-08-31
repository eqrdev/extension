export class ProfileUrl {
  private readonly profileName: string = ''
  private DEFAULT_PROTOCOL = 'https://'
  private DEFAULT_URL = 'equalizer.dev/me/'
  private URL_REGEX = /#URL#/g

  constructor(profileName: string) {
    if (typeof this.profileName !== 'string') {
      return
    }

    this.profileName = profileName
  }

  get base() {
    return this.DEFAULT_URL + this.profileName
  }

  get full() {
    return this.DEFAULT_PROTOCOL + this.base
  }

  get name() {
    return this.profileName
  }

  get placeholder() {
    return this.DEFAULT_PROTOCOL + this.DEFAULT_URL + 'my-profile'
  }

  replaceInText(text: string): string {
    return typeof text === 'string'
      ? text.replaceAll(this.URL_REGEX, this.full)
      : ''
  }

  replaceWithPlaceholder(text: string): string {
    return text.replaceAll(this.URL_REGEX, this.placeholder)
  }
}
