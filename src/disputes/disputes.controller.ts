import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, UserRole } from '../common/decorators/roles.decorator';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';

@Controller('disputes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DisputesController {
  constructor(private readonly service: DisputesService) {}

  @Post()
  @Roles(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN)
  async create(@Request() req, @Body() dto: CreateDisputeDto) {
    return this.service.create(req.user.id, req.user.role, dto);
  }

  @Get('my')
  @Roles(UserRole.BUYER, UserRole.SELLER)
  async my(@Request() req) {
    return this.service.myDisputes(req.user.id);
  }
}

@Controller('admin/disputes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CUSTOMER_SERVICE)
export class AdminDisputesController {
  constructor(private readonly service: DisputesService) {}

  @Get()
  async list(@Query('status') status?: string) {
    return this.service.list(status);
  }

  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() dto: UpdateDisputeDto) {
    return this.service.update(id, req.user.id, dto);
  }
}


