import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles, UserRole } from '../common/decorators/roles.decorator';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    return { product };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  async create(@Body() body: any, @Req() req: any) {
    const payload = { ...body };
    if (req.user.role === UserRole.ADMIN && body.sellerId) {
      payload.sellerId = body.sellerId;
    } else {
      payload.sellerUserId = req.user.id;
    }
    return this.productService.create(payload);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  async update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    if (req.user.role !== UserRole.ADMIN) {
      const product = await this.productService.findOne(id);
      if (!product || product.seller?.userId !== req.user.id) {
        throw new ForbiddenException('Not authorized');
      }
    }
    return this.productService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  async delete(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== UserRole.ADMIN) {
      const product = await this.productService.findOne(id);
      if (!product || product.seller?.userId !== req.user.id) {
        throw new ForbiddenException('Not authorized');
      }
    }
    return this.productService.delete(id);
  }
}
