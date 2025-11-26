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
- `ClubsCarousel`: Horizontal scrolling club cards with join functionality
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
- Routes (`server/routes.ts`): API route registration (currently minimal, ready for expansion)
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
- **Users table**: id (UUID primary key), username (unique text), password (text)
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

### Authentication & Authorization

**Current State:**
- User schema defined with username/password fields
- No authentication implemented yet
- Session storage prepared via `connect-pg-simple` dependency
- Ready for session-based or JWT authentication implementation

**Design Considerations:**
- Faculty status tracking (available/busy/offline) suggests role-based access
- "Authorized personnel only" club creation indicates need for permission system
- Email fields in faculty contacts suggest email-based verification potential

## External Dependencies

### Third-Party Services

**Database:**
- Neon Database (serverless PostgreSQL) via `@neondatabase/serverless`
- Connection via `DATABASE_URL` environment variable

**Development Tools:**
- Replit plugins for development experience (cartographer, dev banner, runtime error modal)
- Vite for fast development builds and HMR

### Key NPM Packages

**UI Framework:**
- `@radix-ui/*`: Comprehensive set of unstyled, accessible UI primitives (accordion, dialog, dropdown, popover, etc.)
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
- `embla-carousel-react`: Carousel/slider component (used in ClubsCarousel)
- `date-fns`: Date manipulation and formatting
- `lucide-react`: Icon library

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
- `tsconfig.json`: TypeScript configuration with path mappings (@/, @shared/, @assets/)
- `vite.config.ts`: Build tool configuration with alias resolution
- `drizzle.config.ts`: Database migration configuration