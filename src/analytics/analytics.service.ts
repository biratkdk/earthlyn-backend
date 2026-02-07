import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalRevenue = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'DELIVERED' },
    });

    const totalOrders = await this.prisma.order.count();
    const totalUsers = await this.prisma.buyer.count();
    const totalSellers = await this.prisma.seller.count();

    return {
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      totalOrders,
      totalUsers,
      totalSellers,
    };
  }

  async getTopSellers(limit: number = 10) {
    return await this.prisma.seller.findMany({
      include: { products: { take: 5 } },
      take: limit,
      orderBy: { products: { _count: 'desc' } },
    });
  }

  async getRevenueTrends(days: number = 30) {
    const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: dateFrom } },
      select: { createdAt: true, totalAmount: true },
    });

    return {
      period: days,
      totalRevenue: orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
      ordersCount: orders.length,
    };
  }

  async getUserGrowth(days: number = 30) {
    const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const newUsers = await this.prisma.buyer.count({
      where: { createdAt: { gte: dateFrom } },
    });

    const newSellers = await this.prisma.seller.count({
      where: { createdAt: { gte: dateFrom } },
    });

    return { newUsers, newSellers, period: days };
  }

  async getEcoImpactStats() {
    const ecoFriendlyProducts = await this.prisma.product.count({
      where: { ecoScore: { gt: 0 } },
    });
    const ecoImpactAgg = await this.prisma.ecoImpact.aggregate({
      _sum: { pointsEarned: true },
      _count: { _all: true },
    });
    const totalPoints = Number(ecoImpactAgg._sum.pointsEarned || 0);

    return {
      ecoFriendlyProducts,
      carbonSaved: Math.floor(totalPoints * 0.2),
      treesPlanted: Math.floor(totalPoints / 50),
    };
  }

  async getProductStats() {
    return {
      pending: await this.prisma.product.count({
        where: { approvalStatus: 'PENDING' },
      }),
      approved: await this.prisma.product.count({
        where: { approvalStatus: 'APPROVED' },
      }),
      rejected: await this.prisma.product.count({
        where: { approvalStatus: 'REJECTED' },
      }),
      total: await this.prisma.product.count(),
    };
  }

  async getReferralStats() {
    const total = await this.prisma.referral.count();
    const pending = await this.prisma.referral.count({ where: { status: 'PENDING' } });
    const completed = await this.prisma.referral.count({ where: { status: 'COMPLETED' } });
    return { total, pending, completed };
  }

  async getSubscriptionStats() {
    const total = await this.prisma.subscription.count();
    const active = await this.prisma.subscription.count({ where: { status: 'ACTIVE' } });
    const cancelled = await this.prisma.subscription.count({ where: { status: 'CANCELLED' } });
    const expired = await this.prisma.subscription.count({ where: { status: 'EXPIRED' } });
    return { total, active, cancelled, expired };
  }

  async getBuyerRetention() {
    const buyers = await this.prisma.user.findMany({
      where: { role: 'BUYER' },
      select: { id: true },
    });
    const buyerIds = buyers.map((b) => b.id);
    const repeatBuyers = await this.prisma.order.groupBy({
      by: ['buyerId'],
      where: { buyerId: { in: buyerIds } },
      _count: { _all: true },
    });
    const retained = repeatBuyers.filter((b) => b._count._all >= 2).length;
    return { totalBuyers: buyerIds.length, repeatBuyers: retained };
  }

  async getTopCategories(limit: number = 10) {
    const categories = await this.prisma.product.groupBy({
      by: ['category'],
      _count: { _all: true },
      orderBy: { _count: { _all: 'desc' } },
      take: limit,
    });
    return categories.map((c) => ({ category: c.category, count: c._count._all }));
  }
}
