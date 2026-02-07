import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles, UserRole } from '../common/decorators/roles.decorator';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@Roles(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN)
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateSubscriptionDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get('my')
  async mine(@Request() req) {
    return this.service.mine(req.user.id);
  }

  @Patch(':id/cancel')
  async cancel(@Request() req, @Param('id') id: string) {
    return this.service.cancel(req.user.id, id);
  }
}
