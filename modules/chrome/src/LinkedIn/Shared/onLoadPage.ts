import { LinkedInUrl, RouteName } from './LinkedInUrl'
import { waitForLinkedinLoad } from './waitForLinkedin'
import { ChromeMessageGateway } from '../../Shared/ChromeMessageGateway'

export const onLoadPage = (routeName: RouteName, callback: () => void) => {
  if (LinkedInUrl.isOnRoute(routeName)) {
    waitForLinkedinLoad().then(() => {
      callback()
    })
  }

  new ChromeMessageGateway({ isBackground: false }).on(
    'Navigate',
    ({ route }) => {
      if (route === routeName) {
        callback()
      }
    }
  )
}
