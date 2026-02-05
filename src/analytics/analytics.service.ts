import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getRevenueTrends(days: number = 30) {
    return await this.prisma.order.groupBy({
      by: ["createdAt"],
      _sum: { total: true },
      where: { createdAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } },
    });
  }

  async getTopSellers(limit: number = 10) {
    return await this.prisma.seller.findMany({
      take: limit,
      orderBy: { totalSales: "desc" },
      include: { user: true },
    });
  }

  async getEcoImpactMetrics() {
    const orders = await this.prisma.order.findMany();
    return {
      totalOrders: orders.length,
      totalCO2Saved: orders.length * 2.5,
      totalEcoPoints: orders.length * 10,
    };
  }

  async getPlatformStats() {
    return {
      totalUsers: await this.prisma.user.count(),
      totalProducts: await this.prisma.product.count(),
      totalOrders: await this.prisma.order.count(),
      totalRevenue: (await this.prisma.order.aggregate({ _sum: { total: true } }))._sum.total || 0,
    };
  }
}