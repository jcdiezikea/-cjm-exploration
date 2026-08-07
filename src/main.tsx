import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ingka/core/dist/style.css'
import './index.css'
import App from './App.tsx'
import { SkapaProvider } from './skapa/SkapaProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SkapaProvider>
      <App />
    </SkapaProvider>
  </StrictMode>,
)
