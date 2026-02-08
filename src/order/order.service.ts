import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, TransactionType } from '@prisma/client';

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

  // Cancel an order - refund payment, restore inventory, create refund transaction
  async cancelOrder(orderId: string, userId: string): Promise<any> {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
      include: {
        product: true,
        buyer: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Verify authorization - only buyer or admin can cancel
    if (order.buyerId !== userId) {
      throw new BadRequestException('Not authorized to cancel this order');
    }

    // Check if order can be cancelled (only PENDING or CONFIRMED)
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new BadRequestException(
        `Cannot cancel order with status ${order.status}. Only PENDING and CONFIRMED orders can be cancelled.`,
      );
    }

    return this.prismaService.$transaction(async (tx) => {
      // Update order status to CANCELLED
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED' as OrderStatus,
          updatedAt: new Date(),
        },
        include: {
          product: true,
          buyer: true,
        },
      });

      // Restore inventory
      await tx.product.update({
        where: { id: order.productId },
        data: {
          stock: order.product.stock + order.quantity,
        },
      });

      // Create refund transaction for buyer
      const refundAmount = Number(order.totalAmount);
      await tx.transaction.create({
        data: {
          userId: order.buyerId,
          type: 'CREDIT' as TransactionType,
          amount: refundAmount,
          description: `Refund for cancelled order ${orderId}`,
          referenceType: 'ORDER_CANCELLATION',
          referenceId: orderId,
        },
      });

      // Update user balance with refund
      const buyerUser = await tx.user.findUnique({
        where: { id: order.buyerId },
        select: { balance: true },
      });

      if (buyerUser) {
        await tx.user.update({
          where: { id: order.buyerId },
          data: {
            balance: Number(buyerUser.balance) + refundAmount,
          },
        });
      }

      // TODO: Process Stripe refund if paymentIntentId exists
      // This would require Stripe API integration
      if (order.paymentIntentId) {
        // await this.stripeService.refundPayment(order.paymentIntentId);
        console.log(`[STRIPE REFUND PENDING] Order ${orderId}, Intent: ${order.paymentIntentId}`);
      }

      return updatedOrder;
    });
  }
}
