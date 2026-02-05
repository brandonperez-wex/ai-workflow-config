---
name: frontend-design
description: Create polished, production-ready React UI components with TypeScript and Tailwind CSS. Use when building user interfaces.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Bash
---

# Frontend Design

Create distinctive, production-grade React interfaces with high design quality.

## Tech Stack

- **React 19+** with functional components and hooks
- **TypeScript** with strict types
- **Tailwind CSS v4** with `@theme` directive
- **shadcn/ui** for base components
- **Framer Motion** for animations

## Component Structure

```typescript
import { cn } from '@/lib/utils';

interface MyComponentProps {
  className?: string;
  // other props
}

export function MyComponent({ className, ...props }: MyComponentProps) {
  return (
    <div className={cn('base-classes', className)}>
      {/* content */}
    </div>
  );
}
```

## Design Principles

### Visual Hierarchy
- Use size, color, and spacing to guide attention
- Primary actions should be prominent
- Group related elements

### Consistency
- Use design tokens from `@theme`
- Maintain consistent spacing (4px grid)
- Reuse patterns across components

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Sufficient color contrast

### Responsiveness
- Mobile-first approach
- Use Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Test at multiple viewport sizes

## Tailwind v4 Patterns

### Theme Variables
```css
@theme {
  --color-primary: hsl(222.2 47.4% 11.2%);
  --color-secondary: hsl(210 40% 96%);
  --radius: 0.5rem;
}
```

### Using Variables
```tsx
<div className="bg-primary text-primary-foreground rounded-[--radius]">
```

### Logical Properties (RTL Support)
```tsx
// Use these (logical)
<div className="ms-4 me-2 ps-3 pe-3">

// Not these (physical)
<div className="ml-4 mr-2 pl-3 pr-3">
```

## Animation with Framer Motion

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>
```

## shadcn/ui Usage

```bash
# Install component
npx shadcn@latest add button

# Use in code
import { Button } from '@/components/ui/button';

<Button variant="outline" size="sm">
  Click me
</Button>
```

## Guidelines

- Extract repeated patterns into components
- Use `cn()` for conditional classes
- Keep components focused (single responsibility)
- Co-locate styles with components
- Avoid inline styles except for dynamic values
