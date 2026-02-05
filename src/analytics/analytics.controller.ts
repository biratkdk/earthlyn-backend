import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, AdminGuard)
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
}
