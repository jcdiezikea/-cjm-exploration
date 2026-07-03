import type { ReactNode } from 'react'
import { SKAPA_THEME_ID } from './skapaConfig.ts'

type SkapaProviderProps = {
  children: ReactNode
}

export function SkapaProvider({ children }: SkapaProviderProps) {
  return (
    <div data-skapa-theme={SKAPA_THEME_ID} data-skapa-provider="placeholder">
      {children}
    </div>
  )
}
