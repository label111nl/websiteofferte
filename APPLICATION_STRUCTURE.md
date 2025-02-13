# Website Offertes Application Structure

## Overview
A platform for connecting businesses seeking website development with marketers/agencies. The application has two main interfaces: Admin Dashboard and Marketer Dashboard.

## Routes Structure

### Public Routes
- `/` - Homepage (HomePage)
- `/quote` - Quote Request Form (QuotePage)
- `/blog` - Blog Archive (BlogArchivePage)
- `/blog/:slug` - Individual Blog Post (BlogPostPage)
- `/login` - Login Page (Login)
- `/register` - Registration Page (Register)

### Admin Routes
- `/admin` - Admin Dashboard (AdminDashboard)
  - Lead management
  - Lead approval/rejection
  - Statistics overview
- `/admin/blog` - Blog Management (BlogPostsPage)
  - Create/edit/delete blog posts
  - Manage categories and tags
- `/admin/settings` - Admin Settings (AdminSettingsPage)
  - Platform configuration
  - Lead matching settings
  - AI verification settings

### Marketer Routes
- `/dashboard` - Marketer Dashboard (MarketerDashboard)
  - Overview of leads and quotes
  - Performance statistics
- `/dashboard/leads` - Leads Management (LeadsPage)
  - View available leads
  - Submit quotes
- `/dashboard/leads/:id` - Lead Details (LeadDetailsPage)
  - Detailed lead information
  - AI insights
  - Quote submission
- `/dashboard/subscription` - Subscription Management (SubscriptionPage)
- `/dashboard/financial/invoices` - Invoices (InvoicesPage)
- `/dashboard/financial/transactions` - Transactions (TransactionsPage)
- `/dashboard/settings/profile` - Profile Settings (ProfilePage)
- `/dashboard/settings/portfolio` - Portfolio Management (PortfolioPage)
- `/dashboard/settings/company` - Company Settings (CompanyPage)
- `/dashboard/settings/notifications` - Notification Settings (NotificationsPage)

## Core Components

### Layout Components
- `DashboardLayout` - Main layout for authenticated users
  - Responsive sidebar navigation
  - Header with notifications
  - User menu
- `PublicLayout` - Layout for public pages
  - Header with navigation
  - Footer

### Dashboard Components
- `DashboardStats` - Statistics cards
- `LeadTable` - Displays leads in a table format
- `LeadFilters` - Filtering options for leads
- `AIInsights` - AI-powered lead analysis
- `QuoteForm` - Form for submitting quotes
- `SmartRecommendations` - AI-based recommendations

### Blog Components
- `BlogPostsSection` - Featured blog posts
- Blog management interface (admin)
- Blog archive and single post views

### UI Components
- `Button` - Reusable button component
- `Card` - Card container component
- `Dialog` - Modal dialog component
- `Input` - Form input component
- `Label` - Form label component
- `Sheet` - Slide-out panel component
- `Tabs` - Tabbed interface component
- `Textarea` - Multiline text input

## Features

### Lead Management
- Lead submission through quote form
- Admin approval/rejection workflow
- AI-powered lead verification
- Lead-marketer matching system
- Quote submission system

### Blog System
- Full-featured blog with categories and tags
- SEO optimization
- Reading time calculation
- View tracking
- Rich text editing

### User Management
- Role-based access control (Admin/Marketer)
- User profiles and portfolios
- Company information management
- Notification preferences

### Financial System
- Subscription management
- Invoice generation
- Transaction tracking
- Payment processing (Stripe integration)

### AI Features
- Lead quality verification
- Conversion probability analysis
- Price recommendations
- Smart insights generation
- Lead-marketer matching

## Database Structure

### Core Tables
- `users` - User accounts and profiles
- `leads` - Lead information and status
- `quotes` - Quote submissions
- `portfolios` - Marketer portfolios
- `transactions` - Financial transactions
- `notifications` - User notifications

### Blog Tables
- `blog_posts` - Blog articles
- `blog_categories` - Post categories
- `blog_tags` - Post tags
- `blog_posts_categories` - Category relationships
- `blog_posts_tags` - Tag relationships

### Settings Tables
- `admin_settings` - Platform configuration
- `notification_settings` - User notification preferences

## Authentication & Authorization

### Authentication Methods
- Email/password login
- Separate admin login
- Session management

### Authorization
- Role-based access control
- Resource-level permissions
- Row-level security in database

## Third-party Integrations

### Payment Processing
- Stripe for subscriptions and payments
- Invoice generation
- Payment webhook handling

### AI Services
- TensorFlow.js for lead analysis
- Custom AI models for matching
- Automated insights generation

## Development Stack
- React for frontend
- Vite as build tool
- Supabase for backend
- TailwindCSS for styling
- TypeScript for type safety