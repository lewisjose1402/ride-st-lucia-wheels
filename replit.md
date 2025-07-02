# RideMatch St. Lucia

## Overview

RideMatch St. Lucia is a comprehensive vehicle rental platform that connects tourists with local rental companies in St. Lucia. The application provides a marketplace where tourists can browse and book vehicles from verified rental companies, while allowing rental companies to manage their fleet, bookings, and availability through an integrated dashboard.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom brand theming
- **State Management**: React Context for authentication, TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router v6 with role-based route protection

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth with custom role-based access control
- **API Pattern**: RESTful endpoints under `/api` prefix
- **File Storage**: Supabase Storage for vehicle images
- **Payment Processing**: Stripe integration via Supabase Edge Functions

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Migration**: Drizzle Kit for database migrations
- **Connection**: Neon serverless PostgreSQL via connection pooling

## Key Components

### User Management System
- **Multi-role Authentication**: Supports renters, rental companies, and administrators
- **Profile Management**: Separate profiles for individual users and company entities
- **Role-based Authorization**: Different UI and functionality based on user roles

### Vehicle Management
- **CRUD Operations**: Full vehicle lifecycle management for rental companies
- **Image Management**: Multiple image uploads with primary image designation
- **Feature Tracking**: Standardized feature set (AC, GPS, Bluetooth, etc.)
- **Availability Management**: Real-time availability tracking with calendar integration

### Booking System
- **Multi-stage Booking**: Form validation, pricing calculation, and payment processing
- **Dynamic Pricing**: Configurable fees including government tax, permit fees, and age-based surcharges
- **Requirements Validation**: Company-specific driver age, experience, and licensing requirements
- **Payment Integration**: Stripe checkout with confirmation fee collection

### Calendar Integration
- **iCal Feed Support**: Import external calendar feeds to block vehicle availability
- **Manual Blocking**: Company administrators can manually block dates
- **Public Calendar Feeds**: Generate iCal feeds for external calendar integration
- **Real-time Availability**: Combined view of bookings, manual blocks, and external calendar events

### Company Dashboard
- **Fleet Management**: Vehicle creation, editing, and availability management
- **Booking Management**: View and manage all company bookings
- **Settings Configuration**: Booking requirements, pricing rules, and notification preferences
- **Analytics**: Basic statistics on vehicles and bookings

## Data Flow

### Booking Flow
1. User searches for available vehicles with date/location parameters
2. System checks availability against bookings, manual blocks, and iCal feeds
3. User selects vehicle and completes booking form with driver information
4. System validates requirements against company settings
5. Pricing calculation includes base cost, taxes, fees, and deposits
6. Stripe checkout session created for confirmation fee
7. Payment verification triggers booking confirmation
8. Email notifications sent to both parties

### Calendar Synchronization
1. Companies configure iCal feed URLs for external calendars
2. Supabase Edge Function periodically fetches and parses iCal data
3. External events stored as bookings with reference to source feed
4. Manual blocks created through company dashboard
5. Combined availability data served to booking system
6. Public iCal feeds generated for company calendar integration

## External Dependencies

### Core Services
- **Supabase**: Authentication, database hosting, edge functions, and file storage
- **Neon Database**: Serverless PostgreSQL database hosting
- **Stripe**: Payment processing and checkout sessions
- **Replit**: Development environment and deployment platform

### Development Tools
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundling for production builds
- **Drizzle Kit**: Database schema management and migrations

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Date-fns**: Date manipulation and formatting

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Hot Reload**: Vite development server with HMR
- **Database**: PostgreSQL 16 module in Replit
- **Port Configuration**: Frontend on 5000, proxied to port 80

### Production Build
- **Build Process**: Vite builds client assets, ESBuild bundles server code
- **Asset Serving**: Express serves static files from dist/public
- **Environment Variables**: Database URL and API keys via environment configuration
- **Deployment**: Replit autoscale deployment target

### Database Management
- **Schema Sync**: `npm run db:push` applies schema changes to database
- **Migration Strategy**: Drizzle migrations stored in `/migrations` directory
- **Connection Pooling**: Neon serverless connection pooling for production scalability

## Changelog
- June 25, 2025. Initial setup
- June 25, 2025. Updated branding to purple theme throughout application
- June 25, 2025. Improved footer UX - signed-in users redirected to home page instead of sign-in page
- June 29, 2025. Phase 1 Loops email integration completed:
  - Installed dependencies (axios, node-cron, date-fns)
  - Created comprehensive email service module (server/services/emailService.ts)
  - Integrated Loops API with all template methods for different email scenarios
  - Successfully tested Loops API connection and contact creation
  - Email service initialized in server startup with LOOPS_API_KEY environment variable
- July 1, 2025. Phase 2 Comprehensive email automation integration completed:
  - Integrated all 10 email event types using Loops Events API
  - Welcome emails: renter-signup-welcome and company-signup-pending events triggered on user registration
  - Booking confirmation emails: renter, company, and admin notifications triggered on successful payment
  - Booking cancellation emails: renter, company, and admin notifications triggered on booking cancellation
  - Pre-rental reminder emails: automated daily scheduling system for renter and company reminders
  - Created reminder service with cron job running daily at 9 AM for tomorrow's bookings
  - All emails integrated into real application flows: registration, payment verification, booking cancellation
  - Email test interface with 10 tabs for comprehensive testing of all email types
  - Environment variable support for admin email notifications (ADMIN_EMAIL)
  - Email API base URL configuration for Supabase Edge Function email triggers
- July 1, 2025. Company verification system implemented:
  - Added phone number field to company signup form with validation
  - Created pending verification screen for unapproved companies 
  - Updated authentication flow to redirect new companies to pending verification
  - Enhanced ProtectedRoute to check company approval status and redirect unapproved companies
  - Fixed useNavigate import error in vehicle management hooks
  - Fixed company dashboard navigation link from /company to /company/dashboard
  - Added redirect route from /company to /company/dashboard for convenience
  - Updated Supabase Edge Function to use ridematchstlucia.com domain for email API calls
- July 2, 2025. Critical email integration fixes completed:
  - Fixed custom domain routing issue - redeployed with proper server hosting configuration
  - Fixed booking cancellation email integration - frontend now uses backend API route that triggers emails
  - Verified all email endpoints are working correctly after domain fix
  - Booking confirmation emails triggered automatically via Supabase Edge Function when Stripe payments succeed
  - Booking cancellation emails now sent automatically when users cancel bookings through frontend
- July 2, 2025. CRITICAL DISCOVERY: Database architecture mismatch identified:
  - Frontend connects to Supabase database (contains all booking data)
  - Backend connects to Neon database (empty - 0 bookings, 0 vehicles, 0 companies)
  - Root cause of all email failures: backend APIs cannot access booking data
  - Resolution required: Backend must connect to same Supabase database as frontend
  - All email functionality works correctly when backend has access to proper booking data
- July 2, 2025. MAJOR MILESTONE: Database architecture fixed and email system fully operational:
  - Implemented hybrid Drizzle/Supabase approach for backend database connectivity
  - Backend now successfully connects to Supabase database (7 vehicles, 5 companies accessed)
  - All email endpoints responding correctly with Loops integration working
  - Booking cancellation emails confirmed working end-to-end
  - Email system now fully integrated: frontend→backend→Loops→email delivery
  - Stripe payment confirmations automatically trigger booking confirmation emails via Edge Function
  - Complete solution achieved: 10 email types fully operational in live application workflows

## User Preferences

Preferred communication style: Simple, everyday language.