import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DeliveryStatus, SellerTier, TransactionType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeliveryManagementService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private getTierRate(tier: SellerTier): number {
    switch (tier) {
      case 'EARTH_GUARDIAN':
        return 0.3;
      case 'EVERGREEN':
        return 0.25;
      case 'BLOOM':
        return 0.2;
      case 'GROWTH':
        return 0.15;
      case 'SPROUT':
        return 0.1;
      case 'SEED':
      default:
        return 0.07;
    }
  }

  private calculateTier(totalSales: number): SellerTier {
    if (totalSales >= 50000) return 'EARTH_GUARDIAN';
    if (totalSales >= 25000) return 'EVERGREEN';
    if (totalSales >= 10000) return 'BLOOM';
    if (totalSales >= 5000) return 'GROWTH';
    if (totalSales >= 1000) return 'SPROUT';
    return 'SEED';
  }

  private calculateRewardPoints(totalAmount: number): number {
    return Math.floor(totalAmount * 0.05);
  }

  async getOrdersByStatus(userId: string, status?: DeliveryStatus) {
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

  async updateDeliveryStatus(
    orderId: string,
    status: DeliveryStatus,
    trackingId?: string,
    sellerUserId?: string,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: { include: { seller: true } },
        buyer: true,
      },
    });

    if (!order || !order.product) throw new Error('Order not found');
    if (sellerUserId && order.product.seller?.userId !== sellerUserId) {
      throw new BadRequestException('Not authorized for this order');
    }

    if (status === 'DELIVERED' && order.status === 'DELIVERED') {
      return order;
    }

    return this.prisma.$transaction(async (tx) => {
      const orderStatus =
        status === 'DELIVERED'
          ? 'DELIVERED'
          : status === 'IN_TRANSIT'
          ? 'SHIPPED'
          : status === 'FAILED'
          ? 'CANCELLED'
          : 'PROCESSING';

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: orderStatus,
          deliveryTrackingId: trackingId || order.product.id,
          deliveredAt: status === 'DELIVERED' ? new Date() : null,
        },
      });

      await tx.product.update({
        where: { id: order.product.id },
        data: { deliveryStatus: status, updatedAt: new Date() },
      });

      if (status !== 'DELIVERED') {
        return updatedOrder;
      }
      if (order.paymentStatus !== 'SUCCEEDED') {
        throw new BadRequestException('Payment not completed');
      }

      const seller = await tx.seller.findUnique({
        where: { id: order.product.sellerId },
      });
      if (!seller) throw new Error('Seller not found');

      const existingCredit = await tx.transaction.findFirst({
        where: {
          referenceType: 'ORDER_DELIVERY',
          referenceId: order.id,
          userId: seller.userId,
        },
      });
      if (existingCredit) return updatedOrder;

      const tierRate = this.getTierRate(seller.tier);
      const totalAmount = Number(order.totalAmount);
      const profitAmount = Number((totalAmount * tierRate).toFixed(2));

      await tx.transaction.create({
        data: {
          userId: seller.userId,
          amount: profitAmount,
          type: 'CREDIT' as TransactionType,
          description: `Profit credit for order ${order.id}`,
          referenceType: 'ORDER_DELIVERY',
          referenceId: order.id,
        },
      });

      const sellerUser = await tx.user.findUnique({
        where: { id: seller.userId },
        select: { balance: true },
      });
      if (!sellerUser) throw new Error('Seller user not found');

      await tx.user.update({
        where: { id: seller.userId },
        data: { balance: Number(sellerUser.balance) + profitAmount },
      });

      const newTotalSales = Number(seller.totalSales) + totalAmount;
      const newTier = this.calculateTier(newTotalSales);
      await tx.seller.update({
        where: { id: seller.id },
        data: { totalSales: newTotalSales, tier: newTier },
      });

      const ecoPointsPerDollar =
        this.configService.get<number>('commerce.ecoPointsPerDollar') ?? 1;
      const ecoPoints = Math.floor(
        totalAmount * ecoPointsPerDollar * (1 + (order.product.ecoScore || 0) / 100),
      );

      const existingEco = await tx.ecoImpact.findFirst({
        where: { orderId: order.id },
      });
      if (!existingEco) {
        await tx.ecoImpact.create({
          data: {
            userId: order.buyerId,
            productId: order.productId,
            orderId: order.id,
            pointsEarned: ecoPoints,
            impact: `Earned ${ecoPoints} eco points for order ${order.id}`,
          },
        });

        const buyerUser = await tx.user.findUnique({
          where: { id: order.buyerId },
          select: { ecoPoints: true },
        });
        if (!buyerUser) throw new BadRequestException('Buyer not found');

        await tx.user.update({
          where: { id: order.buyerId },
          data: { ecoPoints: buyerUser.ecoPoints + ecoPoints },
        });
      }

      // Credit buyer with reward points (5% of order total)
      const rewardPoints = this.calculateRewardPoints(totalAmount);
      const existingReward = await tx.transaction.findFirst({
        where: {
          referenceType: 'ORDER_REWARD_POINTS',
          referenceId: order.id,
          userId: order.buyerId,
        },
      });
      if (!existingReward) {
        await tx.transaction.create({
          data: {
            userId: order.buyerId,
            amount: rewardPoints,
            type: 'CREDIT' as TransactionType,
            description: `Reward points (5% of order value) for order ${order.id}`,
            referenceType: 'ORDER_REWARD_POINTS',
            referenceId: order.id,
          },
        });

        const buyer = await tx.buyer.findUnique({
          where: { userId: order.buyerId },
        });
        if (buyer) {
          await tx.buyer.update({
            where: { id: buyer.id },
            data: { rewardPoints: buyer.rewardPoints + rewardPoints },
          });
        }
      }

      return updatedOrder;
    });
  }

  async getDeliveryStats(userId: string) {
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
