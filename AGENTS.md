# AGENTS.md - AI Agent Guidelines for MIIDO Web

## Project Overview

MIIDO is a Next.js 14 web application for an agricultural AI copilot platform. Bilingual (Spanish/English) marketing site with interactive demos using React 18, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 3.4 with `tailwindcss-animate`
- **UI**: Custom components + Radix UI primitives
- **Fonts**: Fraunces Variable (local)
- **i18n**: Custom context-based (ES/EN)

## Build/Lint/Test Commands

```bash
npm install          # Install dependencies
npm run dev          # Development server (localhost:3000)
npm run build        # Production build (outputs to ./dist)
npm run lint         # Lint codebase
```

**No test framework configured.** If tests are added:
```bash
npm test                              # Run all tests
npm test -- path/to/file.test.ts      # Single test file
```

## Project Structure

```
web/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main landing page
│   ├── layout.tsx         # Root layout with providers
│   ├── globals.css        # Global styles, CSS variables
│   ├── api/               # API routes
│   ├── components/        # Page-specific components
│   ├── hooks/             # Custom hooks (useDarkMode, etc.)
│   ├── i18n/              # Translations & LanguageProvider
│   └── deck/, demo/       # Additional pages
├── src/
│   ├── components/ui/     # Reusable UI (Button, Input)
│   └── lib/utils.ts       # Utilities (cn helper)
└── public/                # Static assets
```

## Code Style Guidelines

### TypeScript
- Strict mode enabled - handle null/undefined
- Explicit type annotations for parameters and returns
- Prefer interfaces over type aliases

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Imports Order
1. `'use client'` directive (if needed)
2. React/Next.js imports
3. Third-party libraries
4. Internal components (`@/` alias)

```typescript
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/src/components/ui/button'
import { useLanguageContext } from './i18n/LanguageProvider'
```

### Naming Conventions
- **Components**: PascalCase (`WorkflowBuilder.tsx`)
- **Hooks**: camelCase with `use` prefix (`useDarkMode.ts`)
- **CSS**: Tailwind utilities; custom classes in kebab-case

### Component Patterns
```typescript
// Use cn() for conditional classes
import { cn } from '@/src/lib/utils'

<div className={cn("base-class", isActive && "active-class", className)} />
```

### Styling
- Tailwind CSS exclusively
- Dark mode: `dark:` prefix
- Font weights: `text-light`, `text-regular`, `text-medium`, `text-semibold`

### Internationalization
```typescript
const { language, t } = useLanguageContext();

// Inline
<span>{language === 'es' ? 'Hola' : 'Hello'}</span>

// Translation function
<span>{t('common.greeting')}</span>
```

### Error Handling
```typescript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  return NextResponse.json(await response.json());
} catch (error: any) {
  console.error("Context:", error.message || error);
  return NextResponse.json(
    { success: false, error: error.message || "Unknown error" },
    { status: 500 }
  );
}
```

### React Patterns
- `useCallback` for memoized callbacks
- `useRef` for DOM refs and mutable values
- Clean up effects (listeners, timers) in return function

## Environment & Deployment

- **Node.js**: 20 (GitHub Actions)
- **Package Manager**: npm
- **Deploy**: GitHub Pages (static export to `./dist`)
- **Env vars**: None currently; use `.env.local` if needed

## Common Patterns

### Dynamic Imports (client-only)
```typescript
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })
```

### Scroll Navigation
```typescript
const sectionRef = useRef<HTMLElement>(null);
sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
```

### Intersection Observer Animation
```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => entry.isIntersecting && setIsVisible(true),
    { threshold: 0.3 }
  );
  if (ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
}, []);
```

## Key Config Files

- `next.config.js` - Static export, asset prefix for production
- `tailwind.config.ts` - Theme customization, dark mode
- `tsconfig.json` - Strict mode, `@/` path alias
- `.eslintrc.json` - Extends `next/core-web-vitals`
