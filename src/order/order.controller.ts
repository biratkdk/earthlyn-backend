import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(req.user.id, createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('buyerId') buyerId?: string,
    @Query('status') status?: OrderStatus,
  ) {
    return this.orderService.findAll({ buyerId, status });
  }

  // Specific routes MUST come before generic :id route
  @Get('buyer/:buyerId')
  @UseGuards(JwtAuthGuard)
  findByBuyer(@Param('buyerId') buyerId: string) {
    return this.orderService.findByBuyer(buyerId);
  }

  @Get('status/:status')
  @UseGuards(JwtAuthGuard)
  findByStatus(@Param('status') status: OrderStatus) {
    return this.orderService.findByStatus(status);
  }

  // Generic :id route comes last
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() data: any) {
    return this.orderService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}