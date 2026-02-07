import { Controller, Get, Post, Body, UseGuards, Query, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ManageBalanceDto } from './dto/manage-balance.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  async getUserList(@Query('skip') skip = 0, @Query('take') take = 10) {
    return this.adminService.getUserList(skip, take);
  }

  @Post('approve-seller')
  async approveSeller(@Request() req, @Body() body: { sellerId: string }) {
    return this.adminService.approveSeller(req.user.id, body.sellerId);
  }

  @Post('manage-balance')
  async manageBalance(@Request() req, @Body() manageBalanceDto: ManageBalanceDto) {
    return this.adminService.manageBalance(req.user.id, manageBalanceDto);
  }
}
