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
      include: { seller: true },
    });

    if (!product) {
      throw new Error('Product not found');
    }
    if (product.approvalStatus !== 'APPROVED') {
      throw new Error('Product is not approved');
    }
    if (product.stock < createOrderDto.quantity) {
      throw new Error('Insufficient stock');
    }

    const totalAmount = Number(product.price) * createOrderDto.quantity;

    const autoFulfill = process.env.AUTO_FULFILL === 'true';

    return this.prismaService.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          buyerId,
          productId: createOrderDto.productId,
          quantity: createOrderDto.quantity,
          totalAmount: totalAmount.toString(),
          paymentIntentId: createOrderDto.paymentIntentId,
          paymentStatus: 'PENDING',
          status: autoFulfill ? 'PROCESSING' : 'CONFIRMED',
        },
        include: {
          product: true,
          buyer: true,
        },
      });

      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: product.stock - createOrderDto.quantity,
          deliveryStatus: autoFulfill ? 'IN_TRANSIT' : product.deliveryStatus,
        },
      });

      return order;
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
