import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { WishlistItemDto } from './dto/wishlist-item.dto';
import { WishlistService } from './wishlist.service';

@ApiTags('Wishlist')
@ApiBearerAuth()
@Controller('api/wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  getWishlist(@CurrentUser() user: RequestUser) {
    return this.wishlistService.getWishlist(user.id);
  }

  @Post('items')
  addItem(@CurrentUser() user: RequestUser, @Body() dto: WishlistItemDto) {
    return this.wishlistService.addItem(user.id, dto);
  }

  @Delete('items/:productId')
  removeItem(
    @CurrentUser() user: RequestUser,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeItem(user.id, productId);
  }
}
