import enMessages from '../../_locales/en_US/messages.json'

type MessageKey = keyof typeof enMessages

export type GetMessageType = (
  key: MessageKey,
  substitutions?: string | string[]
) => string

/**
 * We create a typed version of the
 * chrome i18n.getMessage function
 *
 * @see {@link https://developer.chrome.com/docs/extensions/reference/i18n/#examples-getmessage chrome.i18n}
 *
 * @param key
 * @param substitutions
 */
export const i18n = (
  key: MessageKey,
  substitutions?: string | string[]
): string => chrome.i18n.getMessage(key, substitutions)
