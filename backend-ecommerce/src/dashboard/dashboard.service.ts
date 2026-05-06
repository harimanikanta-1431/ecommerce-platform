import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async stats() {
    const [revenue, totalOrders, totalUsers, totalProducts] = await Promise.all([
      this.prisma.order.aggregate({
        where: { deletedAt: null, status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        _sum: { amount: true },
      }),
      this.prisma.order.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.product.count({ where: { deletedAt: null } }),
    ]);

    return {
      totalRevenue: Number((revenue._sum.amount ?? 0).toFixed(2)),
      totalOrders,
      totalUsers,
      totalProducts,
      revenueGrowth: 0,
      ordersGrowth: 0,
      usersGrowth: 0,
      productsGrowth: 0,
    };
  }

  async recentOrders() {
    return this.prisma.order.findMany({
      where: { deletedAt: null },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
    });
  }

  async revenueSeries() {
    const orders = await this.prisma.order.findMany({
      where: {
        deletedAt: null,
        status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
      },
      select: {
        amount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return orders.reduce<Record<string, number>>((series, order) => {
      const key = order.createdAt.toISOString().slice(0, 10);
      series[key] = Number(((series[key] ?? 0) + order.amount).toFixed(2));
      return series;
    }, {});
  }
}
