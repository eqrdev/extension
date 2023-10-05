import type { ReactNode } from 'react'
import { Base } from '../components/Base'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin-ext'] })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Equalizer Docs</title>
      </head>
      <body className={inter.className}>
        <Base>{children}</Base>
      </body>
    </html>
  )
}
