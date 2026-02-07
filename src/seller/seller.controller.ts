import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles, UserRole } from '../common/decorators/roles.decorator';

@Controller('sellers')
@UseGuards(JwtAuthGuard)
export class SellerController {
  constructor(private sellerService: SellerService) {}

  @Post()
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  create(@Req() req: any, @Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.create({ ...createSellerDto, userId: req.user.id });
  }

  @Get()
  findAll() { return this.sellerService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.sellerService.findOne(id); }

  @Patch(':id')
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  async update(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    if (req.user.role !== UserRole.ADMIN) {
      const seller = await this.sellerService.findOne(id);
      if (!seller || seller.userId !== req.user.id) {
        throw new ForbiddenException('Not authorized');
      }
    }
    return this.sellerService.update(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  async remove(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== UserRole.ADMIN) {
      const seller = await this.sellerService.findOne(id);
      if (!seller || seller.userId !== req.user.id) {
        throw new ForbiddenException('Not authorized');
      }
    }
    return this.sellerService.remove(id);
  }
}
