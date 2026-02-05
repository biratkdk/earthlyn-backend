import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DeliveryStatus } from '@prisma/client';

@Injectable()
export class DeliveryManagementService {
  constructor(private prisma: PrismaService) {}

  async getOrdersByStatus(userId: string, status?: DeliveryStatus) {
    // Get orders for a seller by their product's delivery status
    const where: any = { product: { seller: { userId } } };
    if (status) {
      where.product = { ...where.product, deliveryStatus: status };
    }
    
    return await this.prisma.order.findMany({
      where,
      include: { product: true, buyer: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateDeliveryStatus(orderId: string, status: DeliveryStatus, trackingId?: string) {
    const product = await this.prisma.product.findFirst({
      where: { orders: { some: { id: orderId } } },
    });
    
    if (!product) throw new Error('Product not found for this order');
    
    const data: any = { deliveryStatus: status, updatedAt: new Date() };
    
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: status === 'DELIVERED' ? 'COMPLETED' : 'PENDING',
        deliveryTrackingId: trackingId || product.id,
        deliveredAt: status === 'DELIVERED' ? new Date() : null,
      },
    });
    
    // Update product delivery status
    await this.prisma.product.update({
      where: { id: product.id },
      data,
    });

    return order;
  }

  async getDeliveryStats(userId: string) {
    // Get stats for seller's products
    const products = await this.prisma.product.findMany({
      where: { seller: { userId } },
    });

    const stats = {
      total: products.length,
      pending: products.filter(p => p.deliveryStatus === 'PENDING').length,
      inTransit: products.filter(p => p.deliveryStatus === 'IN_TRANSIT').length,
      delivered: products.filter(p => p.deliveryStatus === 'DELIVERED').length,
      failed: products.filter(p => p.deliveryStatus === 'FAILED').length,
    };
    return stats;
  }

  async trackOrder(orderId: string) {
    return await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { 
        id: true, 
        status: true,
        deliveryTrackingId: true, 
        deliveredAt: true, 
        createdAt: true, 
        updatedAt: true,
        product: { select: { deliveryStatus: true } }
      },
    });
  }
}
