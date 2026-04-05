import '@fontsource-variable/geist'
import '@fontsource/noto-kufi-arabic/400.css'
import '@fontsource/noto-kufi-arabic/500.css'
import '@fontsource/noto-kufi-arabic/600.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/app/App'
import '@/lib/i18n'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
