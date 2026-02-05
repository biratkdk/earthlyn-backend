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
    const products = await this.prisma.product.count();

    return {
      ecoFriendlyProducts: Math.floor(products * 0.3),
      carbonSaved: products * 5,
      treesPlanted: Math.floor(products / 2),
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
}