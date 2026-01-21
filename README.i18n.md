# Internationalization (i18n) Setup

This project uses `next-intl` for internationalization support with English (default) and French languages.

## Structure

```
messages/
  ├── en.json       # English translations
  └── fr.json       # French translations

src/
  ├── i18n/
  │   ├── config.ts # Locale configuration
  │   └── request.ts # Request configuration for next-intl
  ├── lib/i18n/
  │   ├── index.ts      # Exports
  │   └── navigation.ts # Localized navigation utilities
  └── middleware.ts # Locale detection and routing
```

## Usage

### 1. Using Translations in Server Components (Default)

```tsx
import { getTranslations } from 'next-intl/server';

export default async function MyComponent() {
  const t = await getTranslations('common');
  
  return <h1>{t('home')}</h1>;
}
```

### Using Translations in Client Components

```tsx
"use client";

import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');
  
  return <h1>{t('home')}</h1>;
}
```

### 2. Using Localized Links

Use the localized `Link` component instead of Next.js default Link:

```tsx
import { Link } from '@/lib/i18n';

export default function Navigation() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
```

### 3. Language Switcher

Add the `LocaleSwitcher` component to allow users to change languages:

```tsx
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function Header() {
  return (
    <header>
      <LocaleSwitcher />
    </header>
  );
}
```

### 4. Adding New Translations

1. Add the translation key to both `messages/en.json` and `messages/fr.json`
2. Use the key in your component with `useTranslations`

Example:
```json
// messages/en.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my feature"
  }
}

// messages/fr.json
{
  "myFeature": {
    "title": "Ma Fonctionnalité",
    "description": "Ceci est ma fonctionnalité"
  }
}
```

```tsx
// Component
const t = useTranslations('myFeature');
return <h1>{t('title')}</h1>;
```

## URL Structure

All routes use **clean URLs without locale prefix**:
- `/` - Home page
- `/about` - About page
- `/contact` - Contact page
- `/login` - Login page

The locale is stored in a cookie and detected from browser settings, not shown in the URL.

## Default Locale

The default locale is English (`en`). When users visit the root URL `/`, they will be redirected to `/en/`.

## Adding New Languages

1. Add the locale to `src/i18n/config.ts`:
```ts
export const locales = ['en', 'fr', 'es'] as const; // Add 'es' for Spanish
export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español', // Add Spanish
};
```

2. Create a new translation file `messages/es.json`
3. Copy the structure from `messages/en.json` and translate the values

## Server vs Client Components

- **Server Components**: Use `useTranslations` from `next-intl`
- **Client Components**: Use `'use client'` directive and `useTranslations` from `next-intl`

Both work the same way thanks to Next.js App Router.

## Type Safety

The translations are fully type-safe. TypeScript will provide autocomplete and error checking for translation keys.
