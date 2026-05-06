import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: this.includeCart(),
    });

    return this.withTotals(cart);
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
    const product = await this.prisma.product.findFirst({
      where: {
        id: dto.productId,
        deletedAt: null,
        status: 'ACTIVE',
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    await this.prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: dto.productId,
        },
      },
      update: {
        quantity: { increment: dto.quantity },
      },
      create: {
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
      },
    });

    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const item = await this.ensureCartItem(userId, itemId);

    if (item.product.stock < dto.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    await this.ensureCartItem(userId, itemId);
    await this.prisma.cartItem.delete({ where: { id: itemId } });

    return this.getCart(userId);
  }

  async clear(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return this.getCart(userId);
  }

  private async ensureCartItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
      include: {
        product: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    return item;
  }

  private includeCart() {
    return {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc' as const,
        },
      },
    };
  }

  private withTotals(cart: {
    items: Array<{ product: { price: number }; quantity: number }>;
  }) {
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12.99;
    const tax = Number((subtotal * 0.0825).toFixed(2));

    return {
      ...cart,
      summary: {
        subtotal: Number(subtotal.toFixed(2)),
        shipping,
        tax,
        total: Number((subtotal + shipping + tax).toFixed(2)),
      },
    };
  }
}
