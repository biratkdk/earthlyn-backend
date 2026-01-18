import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async create(sellerId: string, createProductDto: CreateProductDto) {
    return this.prismaService.product.create({
      data: {
        ...createProductDto,
        sellerId,
      },
    });
  }

  async findAll(filters?: { category?: string; sellerId?: string }) {
    return this.prismaService.product.findMany({
      where: filters,
      include: {
        seller: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prismaService.product.findUnique({
      where: { id },
      include: {
        seller: true,
        orders: true,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    return this.prismaService.product.delete({
      where: { id },
    });
  }

  async findBySeller(sellerId: string) {
    return this.prismaService.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
  }
}