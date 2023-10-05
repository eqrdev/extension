'use client'

import type { ReactNode } from 'react'
import { EqGlobal } from 'ui-library'

export const Base = ({ children }: { children: ReactNode }) => (
  <EqGlobal cacheId="equalizer-docs">{children}</EqGlobal>
)
