import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './lib/i18next.ts'
import './main.css'
import './fonts/inter.css'
import App from './App.tsx'
import { ShortcutProvider } from './context/shortcut-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShortcutProvider>
      <App />
    </ShortcutProvider>
  </StrictMode>,
)
