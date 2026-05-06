import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WishlistItemDto } from './dto/wishlist-item.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const wishlist = await this.prisma.wishlist.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return wishlist;
  }

  async addItem(userId: string, dto: WishlistItemDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, deletedAt: null, status: 'ACTIVE' },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const wishlist = await this.prisma.wishlist.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    await this.prisma.wishlistItem.upsert({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: dto.productId,
        },
      },
      update: {},
      create: {
        wishlistId: wishlist.id,
        productId: dto.productId,
      },
    });

    return this.getWishlist(userId);
  }

  async removeItem(userId: string, productId: string) {
    const wishlist = await this.prisma.wishlist.findUnique({ where: { userId } });

    if (wishlist) {
      await this.prisma.wishlistItem.deleteMany({
        where: {
          wishlistId: wishlist.id,
          productId,
        },
      });
    }

    return this.getWishlist(userId);
  }
}
