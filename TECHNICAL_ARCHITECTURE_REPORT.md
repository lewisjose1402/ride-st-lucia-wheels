# RideMatch St. Lucia - Technical Architecture Report

**Generated:** July 27, 2025  
**Version:** 1.0  
**Application Status:** Production Ready with Live Payment Processing

## Executive Summary

RideMatch St. Lucia is a comprehensive vehicle rental marketplace platform built with modern web technologies. The application connects tourists with local rental companies in St. Lucia through a sophisticated multi-role system supporting renters, rental companies, and platform administrators. The platform features real-time availability management, integrated payment processing, automated email communications, and calendar synchronization capabilities.

## Core Technology Stack

### Frontend Architecture
- **Framework:** React 18.3.1 with TypeScript 5.6.3
- **Build Tool:** Vite 5.4.14 for fast development and optimized production builds
- **UI Components:** Shadcn/ui built on Radix UI primitives (@radix-ui/react-*)
- **Styling:** Tailwind CSS 3.4.17 with custom brand theming and animations
- **State Management:** 
  - React Context API for authentication state
  - TanStack Query 5.60.5 for server state management and caching
- **Form Handling:** React Hook Form 7.55.0 with Zod 3.24.2 validation
- **Routing:** React Router DOM 7.6.2 with role-based route protection
- **Date Management:** Date-fns 3.6.0 and React Day Picker 8.10.1
- **Animation:** Framer Motion 11.13.1 and Tailwind CSS animations

### Backend Architecture
- **Runtime:** Node.js 20 with Express.js 4.21.2
- **Language:** TypeScript with ESM modules
- **Database ORM:** Drizzle ORM 0.39.1 with PostgreSQL dialect
- **Database Connection:** @neondatabase/serverless 0.10.4 for connection pooling
- **Session Management:** Express Session 1.18.1 with PostgreSQL session store
- **Authentication:** Passport.js 0.7.0 with Supabase Auth integration
- **Email Service:** Loops API integration with automated scheduling
- **Calendar Integration:** iCal-generator 9.0.0 for calendar feed generation
- **Task Scheduling:** Node-cron 4.1.1 for automated email reminders

### Database Architecture
- **Primary Database:** Supabase PostgreSQL (Production data store)
- **Connection Strategy:** Hybrid Drizzle/Supabase approach
  - Frontend: Direct Supabase client for real-time features
  - Backend: Drizzle ORM with Neon serverless connection pooling
- **Migration Strategy:** Drizzle Kit 0.30.4 for schema management
- **Schema Definition:** Centralized in `shared/schema.ts` with Zod validation schemas

### External Services Integration
- **Authentication:** Supabase Auth with custom role-based access control
- **File Storage:** Supabase Storage for vehicle images and documents
- **Payment Processing:** Stripe integration via Supabase Edge Functions
- **Email Marketing:** Loops API for transactional and marketing emails
- **Deployment:** Replit with autoscale deployment target

## Application Architecture

### Multi-Role System
The application supports three distinct user roles with different capabilities:

#### 1. Renters (Tourists)
- Vehicle search and filtering
- Real-time availability checking
- Booking management with payment processing
- Profile management
- Booking history and cancellation

#### 2. Rental Companies
- Fleet management (CRUD operations on vehicles)
- Booking management and calendar integration
- Company settings and requirements configuration
- Revenue tracking and analytics
- Manual availability blocking
- iCal feed integration for external calendars

#### 3. Platform Administrators
- Company approval/deactivation system
- Vehicle and booking oversight
- Contact form submission management
- System-wide analytics and reporting
- Email campaign management

### Database Schema Overview

#### Core Tables
1. **profiles** - User authentication and basic profile information
2. **rental_companies** - Company details with approval status
3. **vehicles** - Vehicle inventory with features and pricing
4. **vehicle_images** - Image management with primary image designation
5. **bookings** - Complete booking lifecycle with payment tracking
6. **company_settings** - Configurable business rules per company

#### Supporting Tables
7. **vehicle_types** - Standardized vehicle categorization
8. **vehicle_calendar_feeds** - External calendar integration
9. **vehicle_calendar_blocks** - Manual availability blocking
10. **ical_bookings** - External calendar event storage
11. **contact_submissions** - Customer inquiry management

### Key Features Implementation

#### 1. Real-Time Availability System
- **Technology:** Combined query system checking multiple data sources
- **Data Sources:** 
  - Confirmed bookings
  - Manual calendar blocks
  - External iCal feed events
- **Performance:** Optimized queries with proper indexing and caching

#### 2. Payment Processing
- **Integration:** Stripe Checkout Sessions via Supabase Edge Functions
- **Flow:** Frontend → Supabase Edge Function → Stripe → Webhook verification
- **Status:** Live environment with real payment processing
- **Security:** Server-side payment verification with confirmation fees

#### 3. Email Automation System
- **Service:** Loops API integration
- **Automation:** 10 different email event types
- **Scheduling:** Node-cron for daily reminder processing
- **Templates:** 
  - Welcome emails (renter/company signup)
  - Booking confirmations (renter/company/admin)
  - Cancellation notifications
  - Pre-rental reminders
  - Contact form submissions

#### 4. Calendar Integration
- **Export:** iCal feed generation for each vehicle
- **Import:** External calendar feed parsing and integration
- **Compatibility:** Google Calendar, Outlook, Apple Calendar
- **Real-time:** Live availability updates across all platforms

#### 5. Company Deactivation System
- **Multi-layer Protection:**
  - Marketplace filtering (only approved companies visible)
  - Direct URL blocking (individual vehicle page protection)
  - Booking prevention (checkout disabled for deactivated companies)
- **Automatic Updates:** Vehicle visibility changes instantly with company status

## Development Environment

### Build Process
- **Development:** `npm run dev` - Concurrent frontend/backend development
- **Production Build:** 
  - Frontend: Vite build with asset optimization
  - Backend: ESBuild bundling for Node.js deployment
- **Type Checking:** TypeScript strict mode with comprehensive type coverage

### Code Organization
```
project/
├── client/src/           # React frontend application
│   ├── components/       # Reusable UI components
│   ├── pages/           # Route-based page components
│   ├── hooks/           # Custom React hooks
│   └── integrations/    # External service integrations
├── server/              # Express.js backend
│   ├── services/        # Business logic services
│   ├── routes.ts        # API route definitions
│   └── storage.ts       # Database abstraction layer
├── shared/              # Shared TypeScript definitions
│   └── schema.ts        # Database schema and validation
└── supabase/           # Supabase configuration and Edge Functions
```

### Security Implementation
- **Authentication:** JWT tokens with role-based authorization
- **API Security:** CORS configuration for custom domain
- **Input Validation:** Zod schemas for all user inputs
- **SQL Injection Prevention:** Parameterized queries via Drizzle ORM
- **File Upload Security:** Supabase storage with access controls

## Performance Optimizations

### Frontend Performance
- **Code Splitting:** Route-based lazy loading
- **State Management:** TanStack Query for efficient server state caching
- **Image Optimization:** Responsive images with lazy loading
- **Bundle Optimization:** Vite treeshaking and minification

### Backend Performance
- **Database:** Connection pooling with Neon serverless
- **Caching:** Query result caching with TanStack Query
- **API Design:** RESTful endpoints with efficient data fetching
- **Session Management:** PostgreSQL-backed session storage

### Database Performance
- **Indexing:** Proper database indexes on frequently queried fields
- **Query Optimization:** Efficient JOIN queries for complex data retrieval
- **Connection Management:** Serverless connection pooling for scalability

## Deployment Architecture

### Production Environment
- **Platform:** Replit with autoscale deployment
- **Domain:** Custom domain (ridematchstlucia.com) with SSL/TLS
- **Environment Variables:** Secure secret management for API keys
- **Monitoring:** Request logging and error tracking

### CI/CD Pipeline
- **Development:** Hot module replacement with instant feedback
- **Testing:** TypeScript compilation and type checking
- **Deployment:** Automatic deployment on code changes
- **Rollbacks:** Checkpoint system for rapid rollback capability

## API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User authentication
- `POST /api/auth/signout` - Session termination

### Vehicle Management
- `GET /api/vehicles` - Retrieve available vehicles (filtered by company approval)
- `GET /api/vehicles/:id` - Get vehicle details with company information
- `POST /api/vehicles` - Create new vehicle (company role required)
- `PUT /api/vehicles/:id` - Update vehicle information
- `DELETE /api/vehicles/:id` - Remove vehicle from inventory

### Booking System
- `POST /api/bookings` - Create new booking with payment processing
- `GET /api/bookings/user/:id` - Retrieve user booking history
- `GET /api/bookings/company/:id` - Company booking management
- `PUT /api/bookings/:id/cancel` - Cancel booking with email notifications

### Admin Management
- `GET /api/admin/companies` - Company management overview
- `PUT /api/admin/companies/:id` - Approve/deactivate companies
- `GET /api/admin/contact-submissions` - Contact form management

### Calendar Integration
- `GET /api/calendar/:vehicleId/:token` - Public iCal feed generation
- `POST /api/calendar/feeds` - Add external calendar feed
- `POST /api/calendar/blocks` - Manual availability blocking

## Data Flow Architecture

### Booking Process Flow
1. **Vehicle Search:** Frontend queries Supabase with company approval filtering
2. **Availability Check:** Multi-source availability verification
3. **Booking Form:** React Hook Form with Zod validation
4. **Payment Processing:** Stripe Checkout Session creation
5. **Confirmation:** Payment webhook triggers booking confirmation
6. **Email Automation:** Loops API sends confirmation emails to all parties
7. **Calendar Integration:** Booking automatically added to vehicle calendar feeds

### Company Management Flow
1. **Registration:** Company signup with pending approval status
2. **Admin Review:** Platform administrator reviews and approves companies
3. **Activation:** Approved companies gain access to vehicle management
4. **Vehicle Creation:** Companies add vehicles to marketplace
5. **Marketplace Visibility:** Only vehicles from approved companies appear in search results
6. **Deactivation Protection:** Multi-layer system prevents bookings from deactivated companies

## Scalability Considerations

### Current Capacity
- **Database:** Serverless PostgreSQL with automatic scaling
- **Frontend:** CDN-optimized static assets
- **Backend:** Stateless Express.js server with horizontal scaling capability

### Growth Planning
- **Database Optimization:** Query optimization and indexing strategy
- **Caching Strategy:** Redis integration for session and query caching
- **Media Storage:** Supabase Storage with CDN distribution
- **Load Balancing:** Replit autoscale deployment handles traffic spikes

## Security Audit Summary

### Authentication Security
- ✅ Secure JWT token handling
- ✅ Role-based authorization system
- ✅ Session management with secure cookies
- ✅ Password security through Supabase Auth

### Data Protection
- ✅ Input validation on all user inputs
- ✅ SQL injection prevention through ORM
- ✅ CORS configuration for API security
- ✅ Secure file upload handling

### Payment Security
- ✅ PCI compliance through Stripe integration
- ✅ Server-side payment verification
- ✅ Secure webhook handling
- ✅ Live payment environment configuration

## Monitoring and Maintenance

### Error Tracking
- Request/response logging for API endpoints
- Frontend error boundaries for graceful error handling
- Database query logging and optimization monitoring

### Performance Monitoring
- API response time tracking
- Database connection pool monitoring
- Frontend bundle size optimization
- Image loading performance optimization

### Maintenance Procedures
- **Database Backups:** Automated Supabase backup system
- **Schema Updates:** Drizzle Kit migration system
- **Dependency Updates:** Regular security and feature updates
- **Performance Reviews:** Quarterly performance analysis and optimization

## Conclusion

RideMatch St. Lucia represents a mature, production-ready vehicle rental marketplace with comprehensive features for all stakeholders. The architecture prioritizes security, performance, and scalability while maintaining code quality and developer experience. The platform successfully integrates multiple external services and provides a seamless user experience across all user roles.

The application is currently operational in production with live payment processing, real-time availability management, and comprehensive email automation, serving as a complete solution for the St. Lucia vehicle rental market.

---

**Technical Contact:** Development team via platform admin dashboard  
**Last Updated:** July 27, 2025  
**Documentation Version:** 1.0