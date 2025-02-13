import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routes'
import { LoadingComponent } from '@/components/error/LoadingComponent'

// Create and export the router instance
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultComponent: LoadingComponent,
  context: {
    auth: undefined,
  },
})

// Type augmentation for router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Export everything from routes
export * from './routes'

// Export common types
export type { Router } from '@tanstack/react-router' 