# CampusConnect Design Guidelines

## Design Approach
**Bento Grid Architecture** - Modern modular card-based layout inspired by Apple and Linear, organizing content into distinct visual boxes for clean information hierarchy.

## Layout System

### 3-Column Structure
- **Left Sidebar (25%)**: "Academic Anchor" - Fixed resources (Notes, Contacts, Schedule)
- **Center Column (50%)**: "Campus Pulse" - Dynamic content (Clubs, Events, Map)
- **Right Sidebar (25%)**: "Innovation Hub" - Project exploration and uploads

### Spacing
Use Tailwind units: **2, 4, 6, 8, 12, 16** for consistent spacing rhythm.

## Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable sans-serif
- **Hierarchy**: Clear size distinction - section titles (xl-2xl), card titles (lg), body text (base-sm)

## Color Palette
- **Primary**: Purple/Indigo (#6366f1) - Wisdom & Technology
- **Accent 1**: Rose/Pink (#f43f5e) - Social/Events/Connection
- **Accent 2**: Amber/Orange (#f59e0b) - Discussion/Ideas
- **Background**: Light/Dark mode hybrid with soft grays and whites
- **Status Indicators**: Green (Available), Yellow (Busy/In Class)

## Component Library

### Left Sidebar: Study Portal
**Design**: Vertical card with glassmorphism background (backdrop-blur)
- **My Notes Accordion**: Collapsible subject list, expands to show recent uploads
- **Faculty Contacts Accordion**: Professor list with live status indicators (colored dots)
- **Schedule**: Immediate next class display at top

### Center Column Components

**A. Campus Clubs (Top)**
- **Layout**: Horizontal scroll carousel
- **Cards**: Club name, description, member count
- **CTA**: "Join" button on each card
- **Special Feature**: "Create Club" button with lock icon (authorized personnel only)

**B. Upcoming Events (Middle)**
- **Layout**: Vertical list
- **Card Design**: Minimalist with bold date box (left), title, location
- **Purpose**: Single source of truth for campus events

**C. Navigation Map (Bottom)**
- **Style**: Dark mode, Uber-style map interface
- **Search**: Floating "Where to?" search bar (Google Maps style)
- **Live Panel**: Bottom floating panel showing current location + nearby events
- **Visual**: Isometric/3D map styling for high-tech feel

### Right Sidebar: Project Showcase
- **Layout**: Vertical feed (TikTok/Reels style aspect ratios)
- **Content**: Trending student projects with thumbnails, titles, creator names
- **CTA**: Sticky "Upload Project" button pinned to bottom (always accessible)

## Micro-Interactions
- **Hover Lift**: Subtle elevation on all cards (shadow + transform)
- **Smooth Transitions**: 200-300ms ease for all state changes
- **Status Pulses**: Gentle animation on live status indicators
- **Scroll Behavior**: Smooth horizontal scroll for club carousel

## Glassmorphism Effects
Apply to left sidebar and floating elements:
- `backdrop-filter: blur(10px)`
- Semi-transparent backgrounds (bg-opacity-80-90)
- Subtle borders for definition

## Images
**Hero Section**: Not applicable - Bento Grid starts immediately
**Map Section**: Custom isometric campus map illustration (dark mode, navigational style)
**Project Cards**: User-uploaded project thumbnails in 16:9 or 4:5 ratio
**Club Cards**: Optional club logos/banners

## Responsive Behavior
- **Desktop**: Full 3-column Bento layout
- **Tablet**: Stack to 2 columns (combine left + center OR center + right)
- **Mobile**: Single column, collapsible sections with priority: Events → Clubs → Map → Notes → Projects

## Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation for carousels and accordions
- Status indicators must have text alternatives
- Maintain WCAG AA contrast ratios with color combinations