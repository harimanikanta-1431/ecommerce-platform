import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WishlistItemDto {
  @ApiProperty()
  @IsString()
  productId: string;
}
