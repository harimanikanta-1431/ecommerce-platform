# VistaMart Ecommerce Platform

This monorepo contains the production-oriented ecommerce stack:

```text
angular/             Angular admin dashboard
backend-ecommerce/   NestJS API, Prisma ORM, PostgreSQL
frontend-next/       Next.js App Router customer storefront
```

## Backend

Main modules:

```text
src/
  auth/ categories/ products/ cart/ orders/
  reviews/ coupons/ payments/ uploads/ users/
  wishlist/ dashboard/ prisma/ common/
prisma/
  schema.prisma
  seed.ts
  migrations/
```

Setup:

```bash
cd backend-ecommerce
cp .env.example .env
npm install
npx prisma migrate dev
npm run seed
npm run start:dev
```

Defaults:

```text
API: http://localhost:3001/api
Swagger: http://localhost:3001/api/docs
Admin: admin@vistamart.test / Admin123!
Customer: customer@vistamart.test / Customer123!
```

## Storefront

The Next.js app reads live catalog/cart/order/auth data from the backend through
`frontend-next/lib/api.ts`.

```bash
cd frontend-next
npm install
NEXT_PUBLIC_API_URL=http://localhost:3001/api npm run dev
```

Important routes:

```text
/                    Dynamic home catalog
/products            Search, filters, sort, pagination
/products/[slug]     Dynamic product details
/cart                Persistent user cart
/checkout            Order placement flow
/account             User dashboard
/account/orders      User order history
/wishlist            User wishlist
```

## Admin

The Angular dashboard uses `HttpClient`, an auth interceptor, and a route guard
to call the same backend APIs.

```bash
cd angular
npm install
npm start
```

Admin features now use database-backed data:

```text
Dashboard analytics
Product CRUD and image uploads
Category CRUD
Order status management
User status management
JWT-protected admin routes
```

## Production Notes

Use distinct secrets and origins in production:

```text
backend-ecommerce/.env
  DATABASE_URL
  JWT_SECRET
  JWT_EXPIRATION
  PORT
  ADMIN_ORIGIN
  STOREFRONT_ORIGIN

frontend-next/.env.local
  NEXT_PUBLIC_API_URL
```

Deployment order:

```bash
cd backend-ecommerce
npm ci
npx prisma migrate deploy
npm run seed
npm run build
npm run start:prod

cd ../frontend-next
npm ci
npm run build
npm run start

cd ../angular
npm ci
npm run build
```

Serve `angular/dist/fusion-angular-tailwind-starter` from your static host and
point both frontends at the deployed backend API.
