const ROUTE_NAMES = [
  'Feed',
  'MyNetwork',
  'Jobs',
  'Messaging',
  'Notifications',
] as const

export type RouteName = (typeof ROUTE_NAMES)[number]

export class LinkedInUrl {
  static BaseUrl = 'https://www.linkedin.com/'

  private prefixes: Record<RouteName, string> = {
    Feed: 'feed',
    MyNetwork: 'mynetwork',
    Jobs: 'jobs',
    Messaging: 'messaging',
    Notifications: 'notifications',
  }

  getFullUrl(routeName: RouteName) {
    return LinkedInUrl.BaseUrl + this.getRoute(routeName) + '/'
  }

  getRoute(routeName: RouteName) {
    return this.prefixes[routeName]
  }

  isOnRoute(routeName: RouteName) {
    document.location.pathname.startsWith(`/${this.getRoute(routeName)}`)
  }
}
