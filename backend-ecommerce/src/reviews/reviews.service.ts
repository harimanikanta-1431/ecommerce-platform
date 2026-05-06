import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, deletedAt: null },
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
    });
  }

  async create(userId: string, dto: CreateReviewDto) {
    await this.productsService.findById(dto.productId);

    const review = await this.prisma.review.upsert({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId,
        },
      },
      create: {
        userId,
        productId: dto.productId,
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment,
      },
      update: {
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await this.productsService.refreshRating(dto.productId);
    return review;
  }

  async update(userId: string, id: string, dto: UpdateReviewDto) {
    const review = await this.ensureOwnReview(userId, id);
    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment,
      },
    });

    await this.productsService.refreshRating(review.productId);
    return updated;
  }

  async remove(userId: string, id: string) {
    const review = await this.ensureOwnReview(userId, id);
    await this.prisma.review.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    await this.productsService.refreshRating(review.productId);

    return { id };
  }

  private async ensureOwnReview(userId: string, id: string) {
    const review = await this.prisma.review.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }
}
