import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, ForbiddenException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { FileUploadService } from '../common/services/file-upload.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles, UserRole } from '../common/decorators/roles.decorator';

@Controller('products')
export class ProductController {
  constructor(
    private productService: ProductService,
    private fileUploadService: FileUploadService,
  ) {}

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

  @Post(':id/upload-image')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    // Verify ownership
    const product = await this.productService.findOne(id);
    if (!product) {
      throw new ForbiddenException('Product not found');
    }
    if (req.user.role !== UserRole.ADMIN && product.seller?.userId !== req.user.id) {
      throw new ForbiddenException('Not authorized to upload image for this product');
    }

    // Upload file
    const imageUrl = await this.fileUploadService.uploadImage(file);

    // Update product with image URL
    const updated = await this.productService.update(id, { imageUrl });
    return { imageUrl, product: updated };
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
