import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePaymentDto) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: dto.orderId,
        userId,
        deletedAt: null,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'CANCELLED') {
      throw new BadRequestException('Cannot pay for a cancelled order');
    }

    const payment = await this.prisma.payment.upsert({
      where: { orderId: dto.orderId },
      create: {
        orderId: dto.orderId,
        provider: dto.provider,
        status: 'PAID',
        amount: order.amount,
        transactionId: dto.transactionId ?? `PAY-${Date.now()}`,
        metadata: {
          mode: 'ui-only',
          capturedAt: new Date().toISOString(),
        },
      },
      update: {
        provider: dto.provider,
        status: 'PAID',
        transactionId: dto.transactionId ?? `PAY-${Date.now()}`,
      },
    });

    await this.prisma.order.update({
      where: { id: dto.orderId },
      data: { status: 'PAID' },
    });

    return payment;
  }

  findAll() {
    return this.prisma.payment.findMany({
      include: {
        order: {
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
      orderBy: { createdAt: 'desc' },
    });
  }
}
