import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        stock: data.stock,
        sellerId: data.sellerId,
        description: data.description || '',
        ecoScore: data.ecoScore || 0,
        category: data.category || 'other',
        processingFee: data.processingFee || 0,
      },
      include: { seller: true },
    });
  }

  async findAll(filters?: any) {
    return this.prisma.product.findMany({
      where: filters || {},
      include: { seller: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { seller: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.product.update({ where: { id }, data, include: { seller: true } });
  }

  async delete(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
