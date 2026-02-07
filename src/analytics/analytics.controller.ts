import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles, UserRole } from '../common/decorators/roles.decorator';

@Controller('admin/analytics')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.ADMIN)
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.service.getDashboardStats();
  }

  @Get('top-sellers')
  async getTopSellers(@Query('limit') limit?: string) {
    return this.service.getTopSellers(parseInt(limit || '10'));
  }

  @Get('revenue-trends')
  async getRevenueTrends(@Query('days') days?: string) {
    return this.service.getRevenueTrends(parseInt(days || '30'));
  }

  @Get('eco-impact')
  async getEcoImpact() {
    return this.service.getEcoImpactStats();
  }

  @Get('user-growth')
  async getUserGrowth(@Query('days') days?: string) {
    return this.service.getUserGrowth(parseInt(days || '30'));
  }

  @Get('products')
  async getProductStats() {
    return this.service.getProductStats();
  }

  @Get('referrals')
  async getReferralStats() {
    return this.service.getReferralStats();
  }

  @Get('subscriptions')
  async getSubscriptionStats() {
    return this.service.getSubscriptionStats();
  }

  @Get('retention')
  async getBuyerRetention() {
    return this.service.getBuyerRetention();
  }

  @Get('categories')
  async getTopCategories(@Query('limit') limit?: string) {
    return this.service.getTopCategories(parseInt(limit || '10'));
  }
}
