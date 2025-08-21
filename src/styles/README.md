# CSS Architecture Guide

This document describes the CSS architecture and organization for the Pregnancy Tracker application.

## Architecture Overview

The CSS is organized using a **layered architecture** that follows the ITCSS (Inverted Triangle CSS) methodology:

```
01-foundations/     # Settings, tokens, and global styles
02-components/      # Reusable UI components  
03-layout/          # Layout compositions and structure
04-views/           # Page-specific styles
main.css           # Master import file
```

## Layer Descriptions

### 1. Foundations (`01-foundations/`)
**Purpose**: Global settings, design tokens, and base styles that affect the entire application.

- `tokens.css` - Design system tokens (spacing, typography, colors, etc.)
- `reset.css` - Modern CSS reset and base element styles
- `theme.css` - Color themes (light/dark mode) and semantic color tokens
- `utilities.css` - Single-purpose utility classes

### 2. Components (`02-components/`)
**Purpose**: Reusable UI components that can be used anywhere in the application.

- `animations.css` - Animation definitions and keyframes
- `buttons.css` - Complete button system (primary, secondary, etc.)
- `forms.css` - Form controls and input styles
- `header.css` - Navigation header component
- `modal.css` - Modal and dialog system
- `loading.css` - Loading states and spinners
- `progress-*.css` - Progress indicators (rings, bars)
- `*-card.css` - Various card components

### 3. Layout (`03-layout/`)
**Purpose**: Page structure, layout compositions, and responsive behavior.

- `app-layout.css` - Main application layout and background elements
- `responsive.css` - Responsive utilities and breakpoint definitions

### 4. Views (`04-views/`)
**Purpose**: Page-specific styles that compose components and layouts.

- `dashboard.css` - Dashboard page styles
- `history.css` - History/log page styles  
- `calendar.css` - Calendar page styles
- `results.css` - Results display styles
- `empty-state.css` - Empty state presentations

## Design System

### Design Tokens
All design values are defined as CSS custom properties in `tokens.css`:

```css
--space-sm: 8px;          /* Spacing */
--font-size-lg: 18px;     /* Typography */  
--radius-md: 10px;        /* Border radius */
--duration-normal: 300ms;  /* Animations */
--ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Color System
Colors are semantic and theme-aware:

```css
--color-text-primary      /* Main text color */
--color-bg-card          /* Card backgrounds */
--color-accent-primary   /* Primary brand color */
--color-success         /* Success states */
```

### Utility Classes
Common patterns available as utility classes:

```css
.flex .items-center .gap-md    /* Layout */
.text-lg .font-semibold       /* Typography */  
.p-lg .m-sm                   /* Spacing */
.rounded-lg .shadow-sm        /* Visual */
```

## Development Guidelines

### Naming Conventions
- **BEM-like** for component styles: `.component-name__element--modifier`
- **Semantic** utility classes: `.flex`, `.text-center`, `.bg-accent`
- **Kebab-case** for CSS custom properties: `--color-bg-primary`

### File Organization Rules
1. **One component per file** in `02-components/`
2. **Alphabetical imports** within each layer
3. **No cross-layer dependencies** (components can't import from views)
4. **Mobile-first** responsive design

### Best Practices
- **Use design tokens** instead of hardcoded values
- **Prefer utility classes** for simple styling
- **Write component classes** for complex, reusable patterns
- **Theme-aware colors** using CSS custom properties
- **Accessible focus states** and reduced motion support

## Theme System

The application supports light/dark themes using CSS custom properties:

```css
:root { --color-bg-app: #ffffff; }
[data-theme="dark"] { --color-bg-app: #000000; }
```

Theme switching is handled automatically via the `data-theme` attribute.

## Performance Considerations

- **Critical CSS first**: Foundations load before components
- **Lazy loading**: Non-critical components can be loaded conditionally  
- **Minimal specificity**: Avoid deep nesting and `!important`
- **Efficient selectors**: Use classes over element selectors

## Import Order

The import order in `main.css` follows the layered architecture:

1. **Foundations** (tokens → reset → theme → utilities)
2. **Layout** (structure before decoration)
3. **Components** (alphabetical within layer)
4. **Views** (page compositions last)

This ensures proper cascade and prevents specificity conflicts.