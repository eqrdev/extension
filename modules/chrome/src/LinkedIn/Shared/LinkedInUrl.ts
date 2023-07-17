const ROUTE_NAMES = [
  'Feed',
  'MyNetwork',
  'Jobs',
  'Messaging',
  'Notifications',
] as const

export type RouteName = (typeof ROUTE_NAMES)[number]

const LINKEDIN_BASE_URL = 'https://www.linkedin.com/'

const ROUTE_PREFIXES: Record<RouteName, string> = {
  Feed: 'feed',
  MyNetwork: 'mynetwork',
  Jobs: 'jobs',
  Messaging: 'messaging',
  Notifications: 'notifications',
}

export class LinkedInUrl {
  static getBase() {
    return LINKEDIN_BASE_URL
  }

  static getByRouteName(routeName: RouteName) {
    return LINKEDIN_BASE_URL + LinkedInUrl.getPrefix(routeName) + '/'
  }

  static getPrefix(routeName: RouteName) {
    return ROUTE_PREFIXES[routeName]
  }

  static isOnRoute(routeName: RouteName): boolean {
    return document.location.pathname.startsWith(
      `/${LinkedInUrl.getPrefix(routeName)}`
    )
  }
}
