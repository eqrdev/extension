import { input } from '@inquirer/prompts'
import { ConfigurationValidator, DEFAULT_AUTO_REPLY_TEXT } from 'equalizer'

type InstallOptions = {
  username: string
  token: string
  message?: string
  openaiKey?: string
}

export class InstallOptionsInquirer {
  async prompt(): Promise<InstallOptions> {
    return {
      username: await input({
        message: 'First, we need your Equalizer username',
        validate: ConfigurationValidator.isEqualizerProfileNameValid,
      }),
      message: await input({
        message:
          'Next, please provide a message for the recruiters. Use the "#URL#" string to replace with your Equalizer profile.',
        default: DEFAULT_AUTO_REPLY_TEXT,
        validate: ConfigurationValidator.isMessageValid,
      }),
      token: await input({
        message:
          'Great. Now you have to type your active LinkedIn session token.',
      }),
      openaiKey: await input({
        message:
          'If you want AI to process your inquiries, enter your OpenAI API key.',
      }),
    }
  }
}
