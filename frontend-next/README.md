# VistaMart Frontend

Modern ecommerce customer frontend built with Next.js App Router, TypeScript,
and Tailwind CSS.

## Structure

```text
app/
  account/
  cart/
  checkout/
  login/
  products/
    [slug]/
  signup/
  wishlist/
components/
  account/
  auth/
  cart/
  checkout/
  layout/
  product/
  ui/
lib/
  api.ts
  auth-client.ts
  types.ts
  utils.ts
```

The storefront is API-driven through `lib/api.ts` and is ready for the NestJS
backend at `NEXT_PUBLIC_API_URL`.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

Create `.env.local` when the backend is not running on the default port:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
