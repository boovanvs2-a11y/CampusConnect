# CampusConnect

## Overview

CampusConnect is a modern campus hub web application designed to consolidate academic resources, social activities, and campus navigation into a single platform. The application features a Bento Grid layout architecture with three main sections: Study Portal (academic resources), Campus Pulse (clubs, events, map), and Innovation Hub (student projects). Built with a full-stack TypeScript architecture, it emphasizes a clean, modular UI inspired by Apple and Linear design patterns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **UI Library**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite

**Design System:**
- Bento Grid layout: 3-column responsive layout (25% left sidebar, 50% center, 25% right sidebar)
- Color palette: Primary (Purple/Indigo #6366f1), Event Accent (Rose/Pink #f43f5e), Discussion Accent (Amber/Orange #f59e0b)
- Theme support: Light/Dark mode with custom CSS variables
- Consistent spacing using Tailwind units: 2, 4, 6, 8, 12, 16
- Typography: Modern sans-serif with clear hierarchy (xl-2xl headings, lg card titles, base-sm body)

**Key Components:**
- `StudyPortal`: Left sidebar with accordions for notes, faculty contacts, and schedule
- `ClubsCarousel`: Horizontal scrolling club cards for student club creation
- `ConnectSection`: Official clubs approved by principal (sourced from student-created clubs)
- `CompactEventsList`: Event listing with registration capability
- `InteractiveMap`: Campus navigation with location search
- `ProjectShowcase`: Vertical feed of student projects
- `ConnectSection`, `DiscussSection`, `SocializeSection`: Social and community features

**Component Patterns:**
- All components use collapsible/expandable sections for space efficiency
- Hover effects with elevation (`hover-elevate` utility classes)
- Consistent card-based layouts with glassmorphism effects
- Status indicators using color-coded dots (green=available, yellow=busy, gray=offline)

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Build Tool**: esbuild for production bundling
- **Development**: tsx for TypeScript execution in dev mode

**Application Structure:**
- Development server (`server/index-dev.ts`): Integrates Vite middleware for HMR
- Production server (`server/index-prod.ts`): Serves static built assets
- Core application (`server/app.ts`): Express app configuration with JSON parsing and logging middleware
- Routes (`server/routes.ts`): API route registration
- Storage layer (`server/storage.ts`): Abstracted storage interface with in-memory implementation

**API Design:**
- RESTful API structure with `/api` prefix
- Request/response logging with timing information
- Raw body access for webhook/payment integrations
- Storage interface pattern for easy database migration

**Current Storage Implementation:**
- In-memory storage (`MemStorage` class) implementing `IStorage` interface
- User management with UUID-based IDs
- Ready for migration to PostgreSQL via Drizzle ORM

### Data Storage

**Database Schema (Prepared for PostgreSQL):**
- **Users table**: id (UUID primary key), username (unique text), password (text), role (student/lecturer/principal)
- **Announcements table**: id, title, content, authorId, authorRole, createdAt (Principal-only)
- **Notes table**: id, title, subject, content, creatorId, createdAt (Lecturer creation)
- **Clubs table**: id, name, description, creatorId, status (pending/approved/rejected), approvedBy, createdAt
- Schema defined using Drizzle ORM with Zod validation
- Configuration ready for Neon Database via `@neondatabase/serverless`

**Migration Strategy:**
- Drizzle Kit configured for schema migrations
- Migration files stored in `./migrations` directory
- Schema source: `./shared/schema.ts`
- Current implementation uses in-memory storage, designed for easy swap to PostgreSQL

**Data Validation:**
- Zod schemas generated from Drizzle table definitions
- Type-safe insert operations via `createInsertSchema`
- Shared schema between client and server (`shared/schema.ts`)

### Club Workflow (Key Feature)

**Club Creation & Approval Process:**
1. **Student Creation**: Students can create clubs via ClubsCarousel (status: "pending")
2. **Principal Approval**: Principal views pending clubs in PrincipalPanel and approves/rejects them
3. **Public Display**: Approved clubs appear in Connect section visible to ALL users (students, lecturers, principal)
4. **Data Source**: Connect section fetches approved clubs from `/api/clubs` endpoint - no mock data

**Endpoints:**
- `GET /api/clubs` - Returns all approved clubs (visible to everyone)
- `POST /api/clubs` - Students create new clubs (status: "pending")
- `GET /api/clubs/pending` - Principal-only: view pending clubs
- `PATCH /api/clubs/:id/approve` - Principal-only: approve a club
- `PATCH /api/clubs/:id/reject` - Principal-only: reject a club

### Authentication & Authorization

**Current State:**
- User schema defined with username/password fields and role field
- Three roles: student, lecturer, principal
- Session-based authentication via Express sessions
- Backend enforces permissions for:
  - Announcements (Principal-only creation)
  - Notes (Lecturer-only creation)
  - Club approval (Principal-only)

**Design Considerations:**
- Faculty status tracking (available/busy/offline) for lecturer availability
- "Authorized personnel only" enforced for sensitive operations
- Email-based interactions via Gmail SMTP for print service

### Print Service

**Current Implementation:**
- **Functionality**: Students/users upload images to be printed
- **Email Integration**: Requests logged on server and forwarded to ankushrampa@gmail.com via Gmail SMTP
- **Technology**: Nodemailer with Gmail authentication using App Passwords
- **File Handling**: Accepts image files (.jpg, .png, .avif, etc.)
- **User Input**: Requires user email address for contact

**Status**: Fully functional with local logging and email forwarding

## External Dependencies

### Third-Party Services

**Database:**
- Neon Database (serverless PostgreSQL) via `@neondatabase/serverless`
- Connection via `DATABASE_URL` environment variable

**Email Service:**
- Gmail SMTP via Nodemailer
- Requires GMAIL_USER and GMAIL_PASSWORD (App Password) environment variables
- Forwards print requests to ankushrampa@gmail.com

**Development Tools:**
- Replit plugins for development experience (cartographer, dev banner, runtime error modal)
- Vite for fast development builds and HMR

### Key NPM Packages

**UI Framework:**
- `@radix-ui/*`: Comprehensive set of unstyled, accessible UI primitives
- `tailwindcss`: Utility-first CSS framework
- `class-variance-authority` & `clsx`: Dynamic className management
- `cmdk`: Command menu component

**Data Management:**
- `@tanstack/react-query`: Server state management and caching
- `drizzle-orm`: TypeScript ORM for SQL databases
- `drizzle-zod`: Zod schema generation from Drizzle tables
- `zod`: TypeScript-first schema validation

**Forms & Validation:**
- `react-hook-form`: Performant form management
- `@hookform/resolvers`: Validation resolver for react-hook-form

**UI Enhancements:**
- `embla-carousel-react`: Carousel/slider component
- `date-fns`: Date manipulation and formatting
- `lucide-react`: Icon library
- `nodemailer`: Email service integration

**Routing:**
- `wouter`: Minimalist routing library for React

### Asset Dependencies

**Generated Images:**
- Campus map visualization: `dark_mode_campus_navigation_map.png`
- Club banners: `tech_club_banner_image.png`, `sports_club_banner_image.png`
- Project thumbnails: `ai_project_thumbnail.png`, `app_design_project_thumbnail.png`, `robotics_project_thumbnail.png`

### Configuration Files

- `components.json`: Shadcn/ui configuration with path aliases
- `tailwind.config.ts`: Custom color palette and theme extensions
- `tsconfig.json`: TypeScript configuration with path mappings
- `vite.config.ts`: Build tool configuration with alias resolution
- `drizzle.config.ts`: Database migration configuration

## Recent Changes (Latest Session)

1. **Demo Notes Restoration**: Added demo notes that persist alongside lecturer-uploaded notes
2. **Section Label Update**: Changed "Study Materials" to "Notes" in StudyPortal
3. **Print Service Enhancement**: 
   - Enhanced with detailed logging for debugging
   - Removed dependency on unstable Gmail SMTP (local logging instead)
   - Requests logged with timestamps and user details
4. **Connect Section Refactor**:
   - Now fetches approved clubs from API (created by students, approved by principal)
   - Removed mock data - displays real clubs from database
   - All users (students, lecturers, principal) see approved clubs in Connect
