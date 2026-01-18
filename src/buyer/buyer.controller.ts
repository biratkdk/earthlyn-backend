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
} from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller('buyers')
export class BuyerController {
  constructor(private buyerService: BuyerService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() createBuyerDto: CreateBuyerDto) {
    return this.buyerService.create(createBuyerDto);
  }

  @Get()
  async findAll() {
    return this.buyerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.buyerService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async update(
    @Param('id') id: string,
    @Body() updateBuyerDto: UpdateBuyerDto,
  ) {
    return this.buyerService.update(id, updateBuyerDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async remove(@Param('id') id: string) {
    return this.buyerService.remove(id);
  }
}
