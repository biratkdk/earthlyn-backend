import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles, UserRole } from '../common/decorators/roles.decorator';

@Controller('buyers')
export class BuyerController {
  constructor(private buyerService: BuyerService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.BUYER, UserRole.ADMIN)
  async create(@Req() req: any, @Body() createBuyerDto: CreateBuyerDto) {
    return this.buyerService.create({ ...createBuyerDto, userId: req.user.id });
  }

  @Get()
  async findAll() {
    return this.buyerService.findAll();
  }

  @Get('balance/current')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.BUYER, UserRole.ADMIN)
  async getBalance(@Req() req: any) {
    const balance = await this.buyerService.getBalance(req.user.id);
    return { balance };
  }

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.BUYER, UserRole.ADMIN)
  async depositFunds(
    @Req() req: any,
    @Body() body: { amount: number; description?: string },
  ) {
    return this.buyerService.depositFunds(
      req.user.id,
      body.amount,
      body.description,
    );
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.BUYER, UserRole.ADMIN)
  async withdrawFunds(
    @Req() req: any,
    @Body() body: { amount: number; description?: string },
  ) {
    return this.buyerService.withdrawFunds(
      req.user.id,
      body.amount,
      body.description,
    );
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.BUYER, UserRole.ADMIN)
  async getTransactionHistory(
    @Req() req: any,
    @Query('limit') limit: string = '20',
    @Query('offset') offset: string = '0',
  ) {
    const transactions = await this.buyerService.getTransactionHistory(
      req.user.id,
      parseInt(limit, 10),
      parseInt(offset, 10),
    );
    return { transactions };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.buyerService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.BUYER, UserRole.ADMIN)
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateBuyerDto: UpdateBuyerDto,
  ) {
    if (req.user.role !== UserRole.ADMIN) {
      const buyer = await this.buyerService.findOne(id);
      if (!buyer || buyer.userId !== req.user.id) {
        throw new ForbiddenException('Not authorized');
      }
    }
    return this.buyerService.update(id, updateBuyerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.BUYER, UserRole.ADMIN)
  async remove(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== UserRole.ADMIN) {
      const buyer = await this.buyerService.findOne(id);
      if (!buyer || buyer.userId !== req.user.id) {
        throw new ForbiddenException('Not authorized');
      }
    }
    return this.buyerService.remove(id);
  }
}
