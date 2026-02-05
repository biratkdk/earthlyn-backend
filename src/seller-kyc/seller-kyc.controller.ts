import { Controller, Post, Get, UseGuards, Body, Param } from '@nestjs/common';
import { SellerKycService } from './seller-kyc.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('seller/kyc')
@UseGuards(JwtAuthGuard)
export class SellerKycController {
  constructor(private readonly service: SellerKycService) {}

  @Post('submit')
  async submitDocuments(@CurrentUser() user: any, @Body() documents: any) {
    return this.service.submitKycDocuments(user.id, documents);
  }

  @Get('status')
  async getStatus(@CurrentUser() user: any) {
    return this.service.getKycStatus(user.id);
  }
}

@Controller('admin/kyc')
@UseGuards(JwtAuthGuard)
export class KycAdminController {
  constructor(private readonly service: SellerKycService) {}

  @Get('pending')
  async getPending() {
    return this.service.getPendingKycRequests();
  }

  @Post(':sellerId/approve')
  async approve(@Param('sellerId') sellerId: string) {
    return this.service.approveKyc(sellerId);
  }

  @Post(':sellerId/reject')
  async reject(@Param('sellerId') sellerId: string) {
    return this.service.rejectKyc(sellerId);
  }
}
