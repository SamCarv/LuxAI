import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './lib/i18next.ts'
import './main.css'
import './fonts/inter.css'
import App from './App.tsx'
import { ShortcutProvider } from './context/shortcut-provider.tsx'
import { ThemeProvider } from './context/theme-provider.tsx'
import { UserProvider } from './context/user-provider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const client = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
    <UserProvider>
    <ThemeProvider>
    <ShortcutProvider>
      <App />
    </ShortcutProvider>
    </ThemeProvider>
    </UserProvider>
    </QueryClientProvider>
  </StrictMode>,
)
