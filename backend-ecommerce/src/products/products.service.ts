import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { slugify } from '../common/utils/slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    await this.ensureCategory(createProductDto.categoryId);

    return this.prisma.product.create({
      data: {
        ...createProductDto,
        slug: await this.uniqueSlug(createProductDto.name),
        images: createProductDto.images ?? [],
        details: createProductDto.details ?? [],
      },
      include: {
        category: true,
      },
    });
  }

  async findAll(query: PaginationQueryDto) {
    const safePage = Math.max(query.page ?? 1, 1);
    const safeLimit = Math.min(Math.max(query.limit ?? 12, 1), 100);
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      status: 'ACTIVE',
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
              { category: { name: { contains: query.search, mode: 'insensitive' } } },
            ],
          }
        : {}),
      ...(query.category
        ? {
            category: {
              OR: [{ slug: query.category }, { id: query.category }],
            },
          }
        : {}),
      ...(query.minPrice || query.maxPrice
        ? {
            price: {
              gte: query.minPrice,
              lte: query.maxPrice,
            },
          }
        : {}),
      ...(query.rating ? { rating: { gte: query.rating } } : {}),
    };
    const orderBy = this.orderBy(query.sort);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
        include: {
          category: true,
        },
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        pages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id "${id}" was not found`);
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, deletedAt: null, status: 'ACTIVE' },
      include: {
        category: true,
        reviews: {
          where: { deletedAt: null },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" was not found`);
    }

    return product;
  }

  async featured(limit = 8) {
    return this.prisma.product.findMany({
      where: { deletedAt: null, status: 'ACTIVE', isFeatured: true },
      take: limit,
      include: { category: true },
      orderBy: { popularity: 'desc' },
    });
  }

  async trending(limit = 8) {
    return this.prisma.product.findMany({
      where: { deletedAt: null, status: 'ACTIVE', isTrending: true },
      take: limit,
      include: { category: true },
      orderBy: [{ popularity: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findById(id);
    if (updateProductDto.categoryId) {
      await this.ensureCategory(updateProductDto.categoryId);
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        slug: updateProductDto.name
          ? await this.uniqueSlug(updateProductDto.name, id)
          : undefined,
      },
      include: {
        category: true,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    await this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'ARCHIVED',
      },
    });

    return { id };
  }

  async findByCategory(category: string, page = 1, limit = 10) {
    const query = new PaginationQueryDto();
    query.category = category;
    query.page = page;
    query.limit = limit;

    return this.findAll(query);
  }

  async refreshRating(productId: string) {
    const aggregate = await this.prisma.review.aggregate({
      where: { productId, deletedAt: null },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: Number((aggregate._avg.rating ?? 0).toFixed(2)),
        reviewCount: aggregate._count.rating,
      },
    });
  }

  private orderBy(sort: PaginationQueryDto['sort']): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case 'price-asc':
        return [{ price: 'asc' }];
      case 'price-desc':
        return [{ price: 'desc' }];
      case 'popularity':
        return [{ popularity: 'desc' }];
      case 'rating':
        return [{ rating: 'desc' }];
      default:
        return [{ createdAt: 'desc' }];
    }
  }

  private async ensureCategory(categoryId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, deletedAt: null },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }

  private async uniqueSlug(name: string, ignoreId?: string) {
    const base = slugify(name);
    let slug = base;
    let suffix = 1;

    while (
      await this.prisma.product.findFirst({
        where: {
          slug,
          ...(ignoreId ? { id: { not: ignoreId } } : {}),
        },
      })
    ) {
      suffix += 1;
      slug = `${base}-${suffix}`;
    }

    return slug;
  }
}
