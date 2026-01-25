# CONTEXT.md

## Prosjektformål

Artby v2 er en B2C markedsplass-bygget på **Mercur**, en open-source markedsplassplattform basert på MedusaJS. Prosjektet består av tre hovedkomponenter:

1. **B2C Storefront** - Next.js-basert kundefrontend for shopping, produktvisning, handlekurv og checkout
2. **Mercur Backend** - MedusaJS-basert backend med Mercur-moduler for selgere, kommisjoner, betalinger og mer
3. **Vendor Panel** - Dashboard for selgere til å administrere produkter, ordrer og butikk

Plattformen støtter multi-vendor markedsplasser hvor flere selgere kan selge produkter gjennom én sentral butikk, med funksjoner som split-order payment, kommisjonssystem, produktgodkjenninger, og mer.

## Tech Stack

### Frontend (B2C Storefront)
- **Next.js 15.5.9** (App Router)
- **React 19.2.1**
- **TypeScript 5**
- **Tailwind CSS 3.4.1**
- **@medusajs/js-sdk 2.2.0** - API-klient
- **@medusajs/ui 4.0.7** - UI-komponenter
- **Algolia** - Søk og indeksering
- **Stripe** - Betalingshåndtering
- **next-intl 3.26.3** - Internasjonalisering
- **react-hook-form + zod** - Form-håndtering og validering

### Backend (Mercur)
- **MedusaJS 2.11.3** - Commerce framework
- **Node.js 20+**
- **PostgreSQL** - Database
- **TypeScript 5.6.2**
- **Yarn workspaces** - Monorepo management
- **Turbo** - Build system

### Mercur Moduler
- `@mercurjs/b2c-core` - Kjernefunksjonalitet for B2C markedsplass
- `@mercurjs/commission` - Kommisjonssystem
- `@mercurjs/algolia` - Algolia-integrasjon
- `@mercurjs/reviews` - Produkt- og selgeranmeldelser
- `@mercurjs/requests` - Godkjenningssystem for produkter/selgere
- `@mercurjs/resend` - E-postnotifikasjoner
- `@mercurjs/payment-stripe-connect` - Stripe Connect for split payments
- `@mercurjs/stripe-tax-provider` - Skatteberegning

### Vendor Panel
- **Vite 5.4.14**
- **React 18.2.0**
- **@medusajs/admin-shared** - Admin-komponenter
- **@tanstack/react-query** - Data fetching
- **react-router-dom** - Routing

## Mappestruktur

```
artby_v2/
├── b2c-marketplace-storefront/     # Next.js storefront
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── [locale]/            # Lokalisert routing
│   │   │   │   ├── (main)/          # Hovedområder
│   │   │   │   │   ├── page.tsx     # Hjemmeside
│   │   │   │   │   ├── products/    # Produktlister
│   │   │   │   │   ├── products/[handle]/  # Produktdetaljer
│   │   │   │   │   ├── cart/        # Handlekurv
│   │   │   │   │   ├── sellers/     # Selgersider
│   │   │   │   │   └── user/        # Brukerområde
│   │   │   │   ├── (checkout)/      # Checkout-flyt
│   │   │   │   └── (auth)/          # Autentisering
│   │   │   ├── layout.tsx           # Root layout
│   │   │   └── providers.tsx        # Context providers
│   │   ├── components/
│   │   │   ├── atoms/               # Grunnleggende komponenter
│   │   │   ├── cells/                # Celle-komponenter
│   │   │   ├── molecules/            # Molekyl-komponenter
│   │   │   ├── organisms/            # Organisme-komponenter
│   │   │   └── sections/             # Seksjonskomponenter
│   │   ├── lib/
│   │   │   ├── data/                 # API-kall (cart, products, etc.)
│   │   │   ├── helpers/              # Hjelpefunksjoner
│   │   │   └── config.ts             # SDK-konfigurasjon
│   │   ├── hooks/                    # Custom hooks
│   │   ├── types/                   # TypeScript-typer
│   │   └── middleware.ts            # Next.js middleware (auth, locale)
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── mercur-backend/                   # Backend monorepo
│   ├── apps/
│   │   └── backend/                  # Medusa backend app
│   │       ├── src/
│   │       ├── medusa-config.ts     # Medusa konfigurasjon
│   │       └── package.json
│   ├── packages/
│   │   ├── framework/               # Mercur framework utilities
│   │   └── modules/                 # Mercur moduler
│   │       ├── b2c-core/            # Kjernefunksjonalitet
│   │       ├── commission/          # Kommisjonssystem
│   │       ├── algolia/             # Algolia-integrasjon
│   │       ├── reviews/             # Anmeldelsessystem
│   │       ├── requests/            # Godkjenningssystem
│   │       ├── resend/              # E-postnotifikasjoner
│   │       ├── payment-stripe-connect/  # Stripe Connect
│   │       └── stripe-tax-provider/    # Skatteberegning
│   ├── package.json
│   └── turbo.json
│
└── vendor-panel/                     # Selger dashboard
    ├── src/
    │   ├── routes/                   # React Router routes
    │   ├── components/               # React-komponenter
    │   ├── hooks/                    # Custom hooks
    │   └── lib/                      # Utilities
    ├── package.json
    └── vite.config.mts
```

## Nøkkelkonfigurasjonsfiler

### `b2c-marketplace-storefront/package.json`
```json
{
  "name": "b2c-storefront",
  "version": "1.5.1",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "15.5.9",
    "react": "^19.2.1",
    "@medusajs/js-sdk": "^2.2.0",
    "@medusajs/ui": "^4.0.7"
  }
}
```

### `b2c-marketplace-storefront/next.config.ts`
- `output: "standalone"` - Standalone build for deployment
- `trailingSlash: false`
- `reactStrictMode: true`
- Remote image patterns konfigurert for S3, Medusa og Mercur CDN-er

### `b2c-marketplace-storefront/tsconfig.json`
- Target: ES2017
- Module resolution: bundler
- Path alias: `@/*` → `./src/*`
- Strict mode aktivert

### `mercur-backend/apps/backend/medusa-config.ts`
- Admin panel deaktivert (separat admin-panel container)
- Mercur plugins konfigurert:
  - `@mercurjs/b2c-core`
  - `@mercurjs/commission`
  - `@mercurjs/algolia`
  - `@mercurjs/reviews`
  - `@mercurjs/requests`
  - `@mercurjs/resend`
- Payment provider: Stripe Connect
- Notification provider: Resend
- Optional S3 file storage

### `b2c-marketplace-storefront/src/lib/config.ts`
```typescript
export const sdk = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
```

### `b2c-marketplace-storefront/src/middleware.ts`
- Håndterer autentisering for beskyttede ruter
- Locale/country code routing basert på URL eller Vercel headers
- Region mapping cache (1 time TTL)
- JWT token validering og expiry-sjekk

## Relevante kildefiler

### Frontend - Routing og Layout
- `src/app/layout.tsx` - Root layout med providers, metadata, font loading
- `src/app/[locale]/(main)/page.tsx` - Hjemmeside med SEO metadata generation
- `src/middleware.ts` - Auth, locale routing, region mapping

### Frontend - Data Layer
- `src/lib/data/cart.ts` - Handlekurv-operasjoner (add, update, remove, region validation)
- `src/lib/data/products.ts` - Produkthenting og filtrering
- `src/lib/data/categories.ts` - Kategorihåndtering
- `src/lib/data/orders.ts` - Ordrehåndtering
- `src/lib/config.ts` - Medusa SDK initialisering

### Frontend - Komponenter
- `src/components/sections/` - Storefront-seksjoner (Hero, ProductListing, Cart, etc.)
- `src/components/organisms/` - Komplekse komponenter
- `src/components/molecules/` - Middels komplekse komponenter
- `src/components/atoms/` - Grunnleggende UI-komponenter

### Backend - Konfigurasjon
- `mercur-backend/apps/backend/medusa-config.ts` - Hovedkonfigurasjon
- `mercur-backend/packages/framework/` - Mercur framework utilities

### Backend - Moduler
- `mercur-backend/packages/modules/b2c-core/src/api/` - REST API endpoints
- `mercur-backend/packages/modules/b2c-core/src/workflows/` - Business logic workflows
- `mercur-backend/packages/modules/b2c-core/src/modules/` - Domain models og services

## Kjente begrensninger og beslutninger

### Arkitektur
1. **Plugin-basert system** - Mercur v1.3.0 introduserte plugin-arkitektur for enklere vedlikehold
2. **Separate admin panel** - Built-in Medusa admin er deaktivert, bruker separat admin-panel container
3. **Monorepo struktur** - Yarn workspaces med Turbo for build orchestration
4. **Standalone Next.js build** - For optimal deployment

### Tekniske beslutninger
1. **Locale = Country Code** - Locale routing bruker country codes (iso_2) i stedet for språkkoder
2. **Region-based routing** - Middleware mapper country codes til regions automatisk
3. **Edge-compatible middleware** - Kan ikke bruke Medusa JS SDK i middleware (Edge runtime)
4. **Cache strategy** - Region mapping caches i 1 time, bruker Next.js cache tags

### Integrasjoner
1. **Algolia** - Brukes for produktsøk og indeksering
2. **Stripe Connect** - Split payment system for multi-vendor ordrer
3. **Resend** - E-postnotifikasjoner for ordrer, godkjenninger, etc.
4. **S3** - Optional file storage for produktbilder

### Begrensninger
1. **Beta status** - Noen edge cases i multi-vendor order processing kan kreve forbedringer
2. **Vendor Panel** - Separate repo, ikke inkludert i denne monorepoen (men referert)
3. **Admin Panel** - Separate repo, ikke inkludert

## Nåværende problemer og TODOs

### Frontend (B2C Storefront)
- `src/lib/data/cart.ts:346` - TODO: Pass a POJO instead of a form entity
- `src/components/organisms/OrderDefails/OrderDetails.tsx:33` - TODO: Check where the statuses should come from
- `src/app/[locale]/(main)/user/orders/page.tsx:83` - TODO: pagination

### Backend/Vendor Panel
- Flere TODOs i vendor-panel relatert til:
  - Workflow execution value resolution
  - Order fetching og linking
  - Payment cancel/capture/refund dates
  - Bulk endpoints for inventory operations
  - API endpoint improvements

### Kjente issues (fra CHANGELOG v1.5.1)
- **Fikset i v1.5.1:**
  - Ordrebehandling og filtrering
  - Promotion-logikk (free shipping, percentage discounts)
  - Wishlist rendering
  - Order confirmation emails
  - Cart calculations

### Potensielle forbedringsområder
1. **Pagination** - Mangler på ordreliste
2. **Bulk operations** - Noen operasjoner trenger bulk endpoints
3. **Error handling** - Noen edge cases kan forbedres
4. **Type safety** - Noen areas kan ha bedre type coverage

## Miljøvariabler (ikke inkludert secrets)

### Frontend
- `MEDUSA_BACKEND_URL` - Backend API URL
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` - Publishable API key
- `NEXT_PUBLIC_SITE_NAME` - Site name for metadata
- `NEXT_PUBLIC_BASE_URL` - Base URL for SEO
- `NEXT_PUBLIC_DEFAULT_REGION` - Default region code
- `NEXT_PUBLIC_ALGOLIA_ID` - Algolia app ID (optional)

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `COOKIE_SECRET` - Cookie encryption secret
- `STORE_CORS` - CORS origins for store API
- `ADMIN_CORS` - CORS origins for admin API
- `VENDOR_CORS` - CORS origins for vendor API
- `AUTH_CORS` - CORS origins for auth endpoints
- `ALGOLIA_API_KEY` - Algolia API key
- `ALGOLIA_APP_ID` - Algolia app ID
- `STRIPE_SECRET_API_KEY` - Stripe secret key
- `RESEND_API_KEY` - Resend API key
- `RESEND_FROM_EMAIL` - Default from email
- `S3_*` - Optional S3 configuration

## Versjoner
- **Mercur**: 1.5.1
- **MedusaJS**: 2.11.3
- **Next.js**: 15.5.9
- **React**: 19.2.1 (storefront), 18.2.0 (vendor panel)
- **TypeScript**: 5.x
- **Node.js**: >=20
