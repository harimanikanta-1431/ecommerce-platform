import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CouponsService } from '../coupons/coupons.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private couponsService: CouponsService,
  ) {}

  async placeOrder(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    for (const item of cart.items) {
      if (item.product.deletedAt || item.product.status !== 'ACTIVE') {
        throw new BadRequestException(`${item.product.name} is unavailable`);
      }
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(`${item.product.name} is out of stock`);
      }
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const couponResult = dto.couponCode
      ? await this.couponsService.validate({
          code: dto.couponCode,
          subtotal,
        })
      : null;
    const discount = couponResult?.discount ?? 0;
    const shipping = subtotal > 150 ? 0 : 12.99;
    const tax = Number(((subtotal - discount) * 0.0825).toFixed(2));
    const amount = Number((subtotal - discount + shipping + tax).toFixed(2));
    const orderNumber = `ORD-${Date.now()}`;

    const order = await this.prisma.$transaction(async (tx) => {
      let addressId = dto.addressId;

      if (!addressId && dto.address) {
        const address = await tx.address.create({
          data: {
            ...dto.address,
            userId,
            type: 'SHIPPING',
          },
        });
        addressId = address.id;
      }

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId,
          subtotal: Number(subtotal.toFixed(2)),
          discount,
          shipping,
          tax,
          amount,
          couponCode: couponResult?.coupon.code,
          status: 'PENDING',
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: this.includeOrder(),
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            popularity: { increment: item.quantity },
          },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      if (couponResult) {
        await tx.coupon.update({
          where: { code: couponResult.coupon.code },
          data: { usedCount: { increment: 1 } },
        });
      }

      return createdOrder;
    });

    return order;
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: Prisma.OrderWhereInput = {
      deletedAt: null,
      ...(query.search
        ? {
            OR: [
              { orderNumber: { contains: query.search, mode: 'insensitive' } },
              { user: { name: { contains: query.search, mode: 'insensitive' } } },
              { user: { email: { contains: query.search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: this.includeOrder(),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findMine(userId: string) {
    return this.prisma.order.findMany({
      where: { userId, deletedAt: null },
      include: this.includeOrder(),
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId?: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        deletedAt: null,
        ...(userId ? { userId } : {}),
      },
      include: this.includeOrder(),
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    await this.findById(id);

    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: this.includeOrder(),
    });
  }

  private includeOrder() {
    return {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      address: true,
      payment: true,
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    };
  }
}
