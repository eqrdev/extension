import {
  ConfigurationValidator,
  DEFAULT_AUTO_REPLY_TEXT,
  ProfileUrl,
} from 'equalizer'

export class MessageProcessor {
  static getMessageBasedOnProfileName(username: string, message: string) {
    if (!ConfigurationValidator.isEqualizerProfileNameValid(username)) {
      throw new Error(`Provided Equalizer profile name ${username} is invalid.`)
    }

    const profileUrl = new ProfileUrl(username)

    const isMessageValid =
      !!message && ConfigurationValidator.isMessageValid(message)

    return profileUrl.replaceInText(
      isMessageValid ? message : DEFAULT_AUTO_REPLY_TEXT,
    )
  }
}
