import { ProfileUrl } from '../ProfileUrl'

describe('when profileName given properly', () => {
  const myProfileUrl = new ProfileUrl('michael-scott')

  it('should return the proper url formats', () => {
    expect(myProfileUrl.base).toBe('equalizer.dev/me/michael-scott')
    expect(myProfileUrl.full).toBe('https://equalizer.dev/me/michael-scott')
    expect(myProfileUrl.name).toBe('michael-scott')
    expect(myProfileUrl.placeholder).toBe('https://equalizer.dev/me/my-profile')
  })

  it('should properly replace the url in text', () => {
    expect(
      myProfileUrl.replaceInText(
        'Hello, I work at the Dunder Mifflin. You can learn more about me here: #URL#'
      )
    ).toBe(
      'Hello, I work at the Dunder Mifflin. You can learn more about me here: https://equalizer.dev/me/michael-scott'
    )
  })

  it('should properly replace the url with a placeholder url in text', () => {
    expect(
      myProfileUrl.replaceWithPlaceholder(
        'Hello, I work at the Dunder Mifflin. You can learn more about me here: #URL#'
      )
    ).toBe(
      'Hello, I work at the Dunder Mifflin. You can learn more about me here: https://equalizer.dev/me/my-profile'
    )
  })
})
