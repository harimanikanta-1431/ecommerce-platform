# Backend Ecommerce

NestJS ecommerce API with Prisma, PostgreSQL, JWT auth, role guards, Swagger,
uploads, seed data, and database-backed ecommerce modules.

## Modules

```text
auth        JWT login/register/me
users       Admin user management
categories Category CRUD
products   Product CRUD, filters, search, sort, featured/trending
cart        Persistent customer cart
orders      Checkout, stock decrement, order status updates
reviews     Product reviews and rating aggregation
coupons     Coupon CRUD and validation
payments    Payment record capture for checkout flow
uploads     Admin image uploads
wishlist    Customer wishlist
dashboard   Admin revenue, order, user, and product analytics
```

## Setup

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run seed
npm run start:dev
```

The API runs at `http://localhost:3001/api`.

Swagger is available at `http://localhost:3001/api/docs`.

Seeded users:

```text
Admin: admin@vistamart.test / Admin123!
Customer: customer@vistamart.test / Customer123!
```

## Scripts

```bash
npm run build
npm run test
npm run lint
npm run seed
npm run start:prod
```

## Production

```bash
npm ci
npx prisma migrate deploy
npm run seed
npm run build
npm run start:prod
```
