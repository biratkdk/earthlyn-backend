import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
@Controller('sellers')
@UseGuards(JwtAuthGuard)
export class SellerController {
  constructor(private sellerService: SellerService) {}
  @Post()
  create(@Body() createSellerDto: CreateSellerDto) { return this.sellerService.create(createSellerDto); }
  @Get()
  findAll() { return this.sellerService.findAll(); }
  @Get(':id')
  findOne(@Param('id') id: string) { return this.sellerService.findOne(id); }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) { return this.sellerService.update(id, data); }
  @Delete(':id')
  remove(@Param('id') id: string) { return this.sellerService.remove(id); }
}
