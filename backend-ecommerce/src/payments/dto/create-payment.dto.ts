import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentProvider } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty({ enum: PaymentProvider, default: PaymentProvider.COD })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider = PaymentProvider.COD;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionId?: string;
}
