# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a pregnancy tracking app built as a React/TypeScript application with Vite. The app allows users to track prenatal measurements, visualize growth progression, and manage pregnancy-related appointments. It focuses on providing a compassionate, anxiety-reducing user experience with precise medical-grade data.

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.1
- **Database**: Dexie (IndexedDB wrapper) for client-side storage
- **Testing**: Vitest with jsdom
- **Charts**: Chart.js, react-chartjs-2, and Recharts
- **Internationalization**: i18next with react-i18next (English and Hungarian)
- **Date Handling**: date-fns
- **Routing**: React Router DOM 7.7.1
- **Styling**: CSS modules with custom design system

## Commands

### Development
```bash
npm run dev          # Start development server (port 3000)
npm run build        # TypeScript compilation + Vite build
npm run preview      # Preview production build
```

### Testing
```bash
npm test             # Run tests with Vitest
npm run test:ui      # Run tests with Vitest UI
```

### Project Structure Commands
The project uses path aliases configured in both vite.config.ts and tsconfig.json:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@services/*` → `src/services/*`
- `@styles/*` → `src/styles/*`

## Architecture

### Core Data Flow
1. **Database Layer**: `src/services/database.ts` - Dexie-based IndexedDB operations
2. **Calculation Layer**: `src/services/calculations.ts` - Medical calculations for gestational age and growth percentiles
3. **State Management**: React useReducer pattern in `App.tsx` for global state
4. **Components**: Modular component structure with separation of concerns

### Key Components
- **App.tsx**: Main application with router and global state management
- **MeasurementForm**: Handles input of ultrasound measurements (CRL, BPD, HC, AC, FL)
- **Dashboard**: Shows current progress with visual size comparisons
- **History/Log**: Displays measurement history with accordion cards
- **GrowthChart**: Visualizes growth trends with percentile ranges
- **Calendar**: Manages appointments and events

### Database Schema
Two main tables via Dexie:
- `measurements`: Stores ultrasound measurement data with gestational age calculations
- `appointments`: Stores calendar events (appointments, medications, milestones)

### Internationalization
- Default language: Hungarian (`hu`)
- Fallback language: English (`en`)
- Translation files managed in `src/i18n.ts`
- All user-facing text should use the `t()` function from react-i18next

## Design Philosophy

The app follows a "compassionate companion" approach:
- **Anxiety-reducing design**: Avoid clinical/scary presentations of data
- **Empathy-first**: Frame medical data with reassuring context
- **Data with soul**: Precise measurements presented warmly
- **Reassurance above all**: Design decisions prioritize user emotional well-being

### Color Scheme
- Light theme with organic, warm tones
- Dark theme support via `data-theme` attribute
- Accent colors: terracotta/peach for warmth
- Status indicators use soft, non-alarming colors

## Key Features

### Measurement Modes
- **CRL Mode**: Early pregnancy (Crown-Rump Length primary)
- **Hadlock Mode**: Later pregnancy (multiple measurements combined)

### Growth Visualization
- Uses medical percentile data for accurate growth assessment
- "River of Normal" visualization style for reassuring context
- Custom tooltips with empathetic language

### Official Measurement System
- One measurement can be marked as "official" for due date calculation
- Binary flag system (`isOfficial: 1` or `0`) in database

## Development Notes

### Code Style
- TypeScript strict mode enabled
- React 19 patterns (no legacy class components)
- Functional components with hooks
- CSS-in-JS avoided in favor of modular CSS

### Data Persistence
- All data stored locally in IndexedDB via Dexie
- No server communication - fully client-side app
- Export/import functionality for data portability

### Error Handling
- ErrorBoundary component wraps main content
- Graceful fallbacks for data loading failures
- User-friendly error messages

### Testing Strategy
- Component testing with React Testing Library
- Vitest for unit tests
- jsdom environment for DOM simulation

## File Organization

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Header, FAB, etc.)
│   ├── dashboard/      # Dashboard-specific components
│   ├── history/        # History/log view components
│   ├── measurements/   # Measurement form components
│   └── calendar/       # Calendar feature components
├── screens/            # Main route components
├── services/           # Business logic and data access
├── styles/             # Organized CSS architecture
│   ├── 01-foundations/ # Reset, theme, tokens
│   ├── 02-components/  # Component-specific styles
│   ├── 03-layout/      # Layout and responsive styles
│   └── 04-views/       # Screen-specific styles
├── types/              # TypeScript type definitions
└── assets/             # Static assets and images
```

## Working with This Codebase

### Adding New Features
1. Consider the compassionate design philosophy
2. Add appropriate internationalization keys to `i18n.ts`
3. Follow the existing component patterns and CSS organization
4. Use the established path aliases
5. Ensure proper TypeScript typing

### Database Changes
- Update the Dexie schema version in `database.ts` if adding new tables
- Provide migration logic for existing users
- Test data persistence across schema changes

### Styling Guidelines
- **Use design tokens**: Always prefer CSS custom properties from `tokens.css` over hardcoded values
- **Follow the layered architecture**: Foundations → Layout → Components → Views
- **Utility-first approach**: Use utility classes for simple styling, component classes for complex patterns
- **BEM-like naming**: `.component-name__element--modifier` for component styles
- **Theme-aware colors**: Use semantic color tokens that adapt to light/dark modes
- **Mobile-first responsive**: Design for mobile, enhance for larger screens
- **Accessibility**: Include focus states and reduced motion support

## Recent Changes
- Added calendar functionality with event management
- Integrated React 19 and latest dependencies
- Enhanced measurement data visualization
- Improved internationalization coverage