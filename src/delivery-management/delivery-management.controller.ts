import { Controller, Get, Post, Param, Body, UseGuards, Query } from '@nestjs/common';
import { DeliveryManagementService } from './delivery-management.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DeliveryStatus } from '@prisma/client';
import { Roles, UserRole } from '../common/decorators/roles.decorator';

@Controller('seller/delivery')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.SELLER, UserRole.ADMIN)
export class DeliveryManagementController {
  constructor(private readonly service: DeliveryManagementService) {}

  @Get('orders')
  async getOrders(@CurrentUser() user: any, @Query('status') status?: string) {
    const statusEnum = status ? DeliveryStatus[status as keyof typeof DeliveryStatus] : undefined;
    return this.service.getOrdersByStatus(user.id, statusEnum);
  }

  @Post(':orderId/update-status')
  async updateStatus(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
    @Body() body: { status: string; trackingId?: string },
  ) {
    const status = DeliveryStatus[body.status as keyof typeof DeliveryStatus];
    return this.service.updateDeliveryStatus(orderId, status, body.trackingId, user.id);
  }

  @Get('stats')
  async getStats(@CurrentUser() user: any) {
    return this.service.getDeliveryStats(user.id);
  }

  @Get(':orderId/track')
  async trackOrder(@Param('orderId') orderId: string) {
    return this.service.trackOrder(orderId);
  }
}
