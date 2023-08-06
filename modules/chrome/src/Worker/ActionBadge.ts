export class ActionBadge {
  static async show() {
    await chrome.action.setBadgeText({ text: '!' })
    await chrome.action.setBadgeBackgroundColor({ color: '#ef4127' })
    await chrome.action.setBadgeTextColor({ color: '#fff' })
  }

  static async hide() {
    await chrome.action.setBadgeText({ text: '' })
  }
}
