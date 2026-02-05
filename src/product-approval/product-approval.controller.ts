import { Controller, Get, Post, Param, UseGuards, Query } from '@nestjs/common';
import { ProductApprovalService } from './product-approval.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('admin/product-approval')
@UseGuards(JwtAuthGuard, AdminGuard)
export class ProductApprovalController {
  constructor(private readonly service: ProductApprovalService) {}

  @Get('pending')
  async getPending(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.service.getPendingProducts(parseInt(skip || '0'), parseInt(take || '10'));
  }

  @Get('approved')
  async getApproved(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.service.getApprovedProducts(parseInt(skip || '0'), parseInt(take || '10'));
  }

  @Get('rejected')
  async getRejected(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.service.getRejectedProducts(parseInt(skip || '0'), parseInt(take || '10'));
  }

  @Get('stats')
  async getStats() {
    return this.service.getProductStats();
  }

  @Post(':productId/approve')
  async approve(@Param('productId') productId: string) {
    return this.service.approveProduct(productId);
  }

  @Post(':productId/reject')
  async reject(@Param('productId') productId: string) {
    return this.service.rejectProduct(productId);
  }
}
