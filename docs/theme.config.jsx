import { useRouter } from 'next/router'
import { useConfig } from 'nextra-theme-docs'

const GITHUB_BASE = 'https://github.com/eqrdev/extension/'
const DOCS_URL = 'https://docs.equalizer.dev/'
const PRODUCT_NAME = 'Equalizer'
const DESCRIPTION = 'Job offer manager for sought software engineers'

export default {
  docsRepositoryBase: `${GITHUB_BASE}tree/main/docs`,
  logo: (
    <>
      <svg
        width="36"
        height="36"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginRight: 8 }}
      >
        <rect width="40" height="40" fill="#272727" />
        <path
          d="M17.5 30H22.5V10H17.5V30ZM10 30H15V20H10V30ZM25 16.25V30H30V16.25H25Z"
          fill="white"
        />
      </svg>
      <span>
        <strong>{PRODUCT_NAME} </strong>
        <span>Docs</span>
      </span>
    </>
  ),
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Equalizer Docs',
      }
    }
  },
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter()
    const { frontMatter } = useConfig()
    const url =
      DOCS_URL + (defaultLocale === locale ? asPath : `/${locale}${asPath}`)

    return (
      <>
        <meta property="og:url" content={url} />
        <meta property="og:title" content={frontMatter.title || PRODUCT_NAME} />
        <meta
          property="og:description"
          content={frontMatter.description || DESCRIPTION}
        />
      </>
    )
  },
  project: {
    link: 'https://github.com/eqrdev/extension',
  },
  chat: {
    link: 'https://discord.gg/Dv3UQ3ZhBb',
  },
  primaryHue: 200,
  primarySaturation: 60,
}
