import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async create(buyerId: string, createOrderDto: CreateOrderDto) {
    const product = await this.prismaService.product.findUnique({
      where: { id: createOrderDto.productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const totalAmount = Number(product.price) * createOrderDto.quantity;

    return this.prismaService.order.create({
      data: {
        buyerId,
        productId: createOrderDto.productId,
        quantity: createOrderDto.quantity,
        totalAmount: totalAmount.toString(),
      },
      include: {
        product: true,
        buyer: true,
      },
    });
  }

  async findAll(filters?: { buyerId?: string; status?: OrderStatus }) {
    return this.prismaService.order.findMany({
      where: filters,
      include: {
        product: true,
        buyer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prismaService.order.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            seller: true,
          },
        },
        buyer: true,
        ecoImpacts: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prismaService.order.update({
      where: { id },
      data,
      include: {
        product: true,
        buyer: true,
      },
    });
  }

  async remove(id: string) {
    return this.prismaService.order.delete({
      where: { id },
    });
  }

  async findByBuyer(buyerId: string) {
    return this.prismaService.order.findMany({
      where: { buyerId },
      include: {
        product: {
          include: {
            seller: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: OrderStatus) {
    return this.prismaService.order.findMany({
      where: { status },
      include: {
        product: true,
        buyer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
