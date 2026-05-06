import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class ValidateCouponDto {
  @ApiProperty({ example: 'WELCOME10' })
  @IsString()
  code: string;

  @ApiProperty({ example: 250 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  subtotal: number;
}
