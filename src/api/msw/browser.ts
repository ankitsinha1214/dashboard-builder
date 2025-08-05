import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// Explicit service worker configuration
export const startWorker = () => {
  return worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js',
      options: {
        scope: '/',
      }
    },
    onUnhandledRequest: 'warn',
    quiet: false // Show detailed logs
  })
}