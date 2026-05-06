import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCouponDto) {
    return this.prisma.coupon.create({
      data: {
        ...dto,
        code: dto.code.toUpperCase(),
      },
    });
  }

  findAll() {
    return this.prisma.coupon.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateCouponDto) {
    await this.ensureExists(id);

    return this.prisma.coupon.update({
      where: { id },
      data: {
        ...dto,
        code: dto.code?.toUpperCase(),
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.coupon.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });

    return { id };
  }

  async validate(dto: ValidateCouponDto) {
    const coupon = await this.prisma.coupon.findFirst({
      where: {
        code: dto.code.toUpperCase(),
        deletedAt: null,
        isActive: true,
      },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      throw new BadRequestException('Coupon is not active yet');
    }
    if (coupon.endsAt && coupon.endsAt < now) {
      throw new BadRequestException('Coupon has expired');
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }
    if (dto.subtotal < coupon.minOrderAmount) {
      throw new BadRequestException(
        `Minimum order amount is ${coupon.minOrderAmount}`,
      );
    }

    const rawDiscount =
      coupon.type === 'PERCENTAGE'
        ? (dto.subtotal * coupon.value) / 100
        : coupon.value;
    const discount = Math.min(rawDiscount, coupon.maxDiscount ?? rawDiscount);

    return {
      coupon,
      discount: Number(discount.toFixed(2)),
    };
  }

  async incrementUsage(code: string) {
    await this.prisma.coupon.update({
      where: { code: code.toUpperCase() },
      data: { usedCount: { increment: 1 } },
    });
  }

  private async ensureExists(id: string) {
    const coupon = await this.prisma.coupon.findFirst({
      where: { id, deletedAt: null },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
  }
}
