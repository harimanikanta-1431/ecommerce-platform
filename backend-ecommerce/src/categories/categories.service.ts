import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { slugify } from '../common/utils/slugify';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        ...dto,
        slug: await this.uniqueSlug(dto.name),
      },
      include: { _count: { select: { products: true } } },
    });

    return this.withProductCount(category);
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const where = {
      deletedAt: null,
      ...(query.search
        ? { name: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    };

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { products: true } } },
        orderBy: { name: 'asc' },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      data: categories.map((category) => this.withProductCount(category)),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findFirst({
      where: { slug, deletedAt: null },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.withProductCount(category);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.ensureExists(id);

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        ...dto,
        slug: dto.name ? await this.uniqueSlug(dto.name, id) : undefined,
      },
      include: { _count: { select: { products: true } } },
    });

    return this.withProductCount(category);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { id };
  }

  private async ensureExists(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
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
      await this.prisma.category.findFirst({
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

  private withProductCount<T extends { _count: { products: number } }>(category: T) {
    const { _count, ...rest } = category;

    return {
      ...rest,
      productCount: _count.products,
    };
  }
}
