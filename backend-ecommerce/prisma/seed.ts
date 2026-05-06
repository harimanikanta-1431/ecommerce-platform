import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const categoryData = [
  {
    name: 'Electronics',
    description: 'Audio, wearables, laptops, and smart devices',
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Fashion',
    description: 'Footwear, bags, and everyday essentials',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Home',
    description: 'Furniture, lighting, and home upgrades',
    image:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Kitchen',
    description: 'Countertop appliances and brewing gear',
    image:
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Beauty',
    description: 'Skincare and personal care best sellers',
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Workspace',
    description: 'Desk, chair, keyboard, and productivity upgrades',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80',
  },
];

const products = [
  {
    name: 'Aurora Noise-Cancelling Headphones',
    category: 'Electronics',
    description:
      'Over-ear wireless headphones with adaptive noise cancellation, plush memory foam, and up to 32 hours of battery life.',
    details: [
      'Hybrid active noise cancellation with transparency mode',
      'USB-C fast charging with 10 minutes for 5 hours playback',
      'Multipoint Bluetooth pairing for phone and laptop',
    ],
    price: 199.99,
    originalPrice: 249.99,
    stock: 34,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=85',
    ],
    isFeatured: true,
    isTrending: true,
    popularity: 98,
  },
  {
    name: 'Pulse Pro Smartwatch',
    category: 'Electronics',
    description:
      'A bright AMOLED smartwatch with health tracking, GPS workouts, and a stainless steel frame.',
    details: [
      'Always-on AMOLED display',
      'Seven-day battery in balanced mode',
      'Heart rate, sleep, stress, and GPS workout tracking',
    ],
    price: 149.5,
    originalPrice: 189.5,
    stock: 46,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
    ],
    isFeatured: true,
    isTrending: true,
    popularity: 92,
  },
  {
    name: 'Stride Knit Sneakers',
    category: 'Fashion',
    description:
      'Lightweight knit sneakers with a cushioned midsole and grippy all-day outsole.',
    details: [
      'Breathable recycled knit upper',
      'Cloudfoam-inspired cushioned sole',
      'Machine washable removable insole',
    ],
    price: 84.99,
    originalPrice: 119.99,
    stock: 82,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85',
    ],
    isFeatured: false,
    isTrending: true,
    popularity: 96,
  },
  {
    name: 'Luma Adjustable Desk Lamp',
    category: 'Home',
    description:
      'Minimal LED desk lamp with adjustable brightness, warm-to-cool color temperature, and touch controls.',
    details: [
      'Five brightness levels and three color temperatures',
      'Low-profile weighted base',
      'Flicker-free LED panel',
    ],
    price: 59.95,
    originalPrice: 74.95,
    stock: 58,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85',
    ],
    isFeatured: true,
    isTrending: false,
    popularity: 85,
  },
  {
    name: 'BrewMate Precision Coffee Maker',
    category: 'Kitchen',
    description:
      'Programmable pour-over style coffee maker with bloom timing, thermal carafe, and reusable filter.',
    details: [
      'SCA-style brew temperature control',
      'Double-wall stainless thermal carafe',
      'Reusable mesh filter included',
    ],
    price: 139.99,
    originalPrice: 169.99,
    stock: 17,
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85',
    ],
    isFeatured: false,
    isTrending: true,
    popularity: 80,
  },
  {
    name: 'Glow Lab Vitamin C Serum',
    category: 'Beauty',
    description:
      'Lightweight daily serum with vitamin C, hyaluronic acid, and a smooth non-sticky finish.',
    details: [
      'Dermatologist-tested formula',
      'Fragrance-free and fast absorbing',
      'Airless pump bottle protects freshness',
    ],
    price: 34,
    stock: 73,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=85',
    ],
    isFeatured: true,
    isTrending: true,
    popularity: 90,
  },
  {
    name: 'ErgoFlow Task Chair',
    category: 'Workspace',
    description:
      'Supportive task chair with adjustable lumbar support, breathable mesh, and smooth recline control.',
    details: [
      'Four-way lumbar adjustment',
      'Breathable performance mesh',
      'Quiet casters for hard floors',
    ],
    price: 279,
    originalPrice: 329,
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=85',
    ],
    isFeatured: false,
    isTrending: true,
    popularity: 76,
  },
  {
    name: 'Apex Air 14 Laptop',
    category: 'Workspace',
    description:
      'Thin 14-inch laptop with a color-rich display, quiet keyboard, and all-day productivity battery.',
    details: [
      '14-inch 2.8K display with slim bezels',
      '16GB memory and 512GB fast storage',
      'Backlit keyboard and precision trackpad',
    ],
    price: 1099,
    originalPrice: 1249,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85',
    ],
    isFeatured: true,
    isTrending: true,
    popularity: 88,
  },
];

async function main() {
  const password = await bcrypt.hash('Admin123!', 12);
  const customerPassword = await bcrypt.hash('Customer123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@vistamart.test' },
    update: {},
    create: {
      email: 'admin@vistamart.test',
      password,
      name: 'Admin User',
      role: UserRole.ADMIN,
      cart: { create: {} },
      wishlist: { create: {} },
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@vistamart.test' },
    update: {},
    create: {
      email: 'customer@vistamart.test',
      password: customerPassword,
      name: 'Avery Stone',
      phone: '+1 555 0100',
      country: 'United States',
      cart: { create: {} },
      wishlist: { create: {} },
      addresses: {
        create: {
          fullName: 'Avery Stone',
          phone: '+1 555 0100',
          line1: '120 Market Street',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94105',
          country: 'United States',
          isDefault: true,
        },
      },
    },
  });

  const categories = new Map<string, string>();
  for (const category of categoryData) {
    const saved = await prisma.category.upsert({
      where: { slug: slugify(category.name) },
      update: {
        description: category.description,
        image: category.image,
        deletedAt: null,
      },
      create: {
        ...category,
        slug: slugify(category.name),
      },
    });
    categories.set(category.name, saved.id);
  }

  const savedProducts: Array<{ id: string; name: string }> = [];
  for (const product of products) {
    const categoryId = categories.get(product.category);
    if (!categoryId) {
      continue;
    }

    const saved = await prisma.product.upsert({
      where: { slug: slugify(product.name) },
      update: {
        ...product,
        category: undefined,
        categoryId,
        deletedAt: null,
      },
      create: {
        ...product,
        slug: slugify(product.name),
        sku: `SKU-${slugify(product.name).slice(0, 16).toUpperCase()}`,
        category: undefined,
        categoryId,
      },
    });
    savedProducts.push(saved);
  }

  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: { isActive: true, deletedAt: null },
    create: {
      code: 'WELCOME10',
      description: '10% off first cart above $100',
      type: 'PERCENTAGE',
      value: 10,
      minOrderAmount: 100,
      maxDiscount: 50,
      usageLimit: 1000,
    },
  });

  const firstProduct = savedProducts[0];
  if (firstProduct) {
    await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: customer.id,
          productId: firstProduct.id,
        },
      },
      update: {
        rating: 5,
        title: 'Quiet and comfortable',
        comment: 'Excellent daily headphones with a premium feel.',
        deletedAt: null,
      },
      create: {
        userId: customer.id,
        productId: firstProduct.id,
        rating: 5,
        title: 'Quiet and comfortable',
        comment: 'Excellent daily headphones with a premium feel.',
      },
    });

    await prisma.product.update({
      where: { id: firstProduct.id },
      data: { rating: 5, reviewCount: 1 },
    });
  }

  console.log(`Seeded admin ${admin.email} and customer ${customer.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
