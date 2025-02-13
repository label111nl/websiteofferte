# Technology Stack

## Frontend Framework
- **React** (v18.3.1)
  - Modern JavaScript library for building user interfaces
  - Uses functional components and hooks
  - Client-side routing with React Router v6

## Build Tools
- **Vite** (v5.4.2)
  - Next-generation frontend tooling
  - Fast development server with HMR
  - Optimized production builds

## Language
- **TypeScript** (v5.5.3)
  - Type-safe JavaScript
  - Enhanced IDE support
  - Better code maintainability

## Styling
- **Tailwind CSS** (v3.4.1)
  - Utility-first CSS framework
  - JIT (Just-In-Time) compilation
  - Custom theme configuration
- **Tailwind Plugins**
  - tailwindcss-animate
  - class-variance-authority
  - clsx & tailwind-merge for class composition

## UI Components
- **Radix UI**
  - Accessible component primitives
  - Used components:
    - Dialog
    - Tabs
    - Label
    - Sheet
    - Avatar
    - Checkbox
    - Select
    - and more
- **Lucide React**
  - Modern icon library
  - SVG-based icons
  - Tree-shakeable

## Backend & Database
- **Supabase**
  - PostgreSQL database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication
  - Storage
  - Edge Functions

## Authentication
- **Supabase Auth**
  - Email/password authentication
  - JWT tokens
  - Session management
  - Role-based access control

## State Management
- **Zustand** (v4.5.2)
  - Lightweight state management
  - Used for:
    - Authentication state
    - Notifications
    - Admin state

## Form Handling
- **React Hook Form** (v7.50.1)
  - Form validation
  - Form state management
  - Error handling
- **Zod** (v3.22.4)
  - Schema validation
  - Type inference

## AI/ML
- **TensorFlow.js** (v4.17.0)
  - Machine learning in the browser
  - Lead analysis
  - Recommendation engine

## Payment Processing
- **Stripe** (v2.4.0)
  - Payment processing
  - Subscription management
  - Invoice generation

## Notifications
- **React Hot Toast** (v2.4.1)
  - Toast notifications
  - Customizable styling
  - Accessible

## Development Tools
- **ESLint**
  - Code linting
  - TypeScript support
  - React hooks rules
- **PostCSS**
  - CSS processing
  - Autoprefixer
  - Tailwind CSS processing

## Deployment
- **Netlify**
  - Static site hosting
  - Continuous deployment
  - Edge functions support

## Security
- **bcryptjs** (v2.4.3)
  - Password hashing
  - Secure credential management

## Project Structure
```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Base UI components
│   └── dashboard/    # Dashboard-specific components
├── pages/            # Route components
│   ├── admin/        # Admin pages
│   ├── blog/         # Blog pages
│   ├── financial/    # Financial pages
│   └── settings/     # Settings pages
├── lib/              # Utility functions and configurations
├── store/            # Zustand state management
├── types/            # TypeScript type definitions
└── services/         # Business logic and API services
```

## Development Environment
- Node.js
- npm package manager
- VS Code (recommended)
- Chrome DevTools

## Key Features Enabled by Stack
1. **Type Safety**
   - TypeScript
   - Zod schema validation
   - Type-safe database queries

2. **Performance**
   - Vite's optimized builds
   - Code splitting
   - Tree shaking
   - Lazy loading

3. **Security**
   - Row Level Security
   - JWT authentication
   - Secure password handling
   - CORS protection

4. **Scalability**
   - PostgreSQL database
   - Edge functions
   - CDN deployment
   - Real-time capabilities

5. **Developer Experience**
   - Hot Module Replacement
   - TypeScript support
   - ESLint integration
   - Component library

6. **Accessibility**
   - ARIA attributes
   - Keyboard navigation
   - Screen reader support
   - Focus management

7. **Testing Capabilities**
   - Unit testing with Vitest
   - Component testing
   - E2E testing support
   - Test utilities

## Version Control
- Git
- Feature branch workflow
- Conventional commits
- Pull request reviews

## CI/CD
- Automated builds
- Deployment previews
- Environment variables
- Build caching