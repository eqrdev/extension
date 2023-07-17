export class ActionBadge {
  static async set() {
    await chrome.action.setBadgeText({ text: '!' })
    await chrome.action.setBadgeBackgroundColor({ color: '#ef4127' })
    await chrome.action.setBadgeTextColor({ color: '#fff' })
  }

  static async remove() {
    await chrome.action.setBadgeText({ text: '' })
  }
}
