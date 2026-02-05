import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

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
  async create(@Body() body: any, @Req() req: any) {
    return this.productService.create({
      ...body,
      sellerId: req.user.id,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() body: any) {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
