export class ConfigurationValidator {
  public static isEqualizerProfileNameValid(profileName: string): boolean {
    return profileName.length && /^[^\s/]+$/i.test(profileName)
  }

  public static isMessageValid(message: string): boolean {
    return message.length && message.includes('#URL#')
  }
}
