import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('api/admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  stats() {
    return this.dashboardService.stats();
  }

  @Get('recent-orders')
  recentOrders() {
    return this.dashboardService.recentOrders();
  }

  @Get('revenue-series')
  revenueSeries() {
    return this.dashboardService.revenueSeries();
  }
}
