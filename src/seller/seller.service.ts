import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { SellerTier } from '@prisma/client';

@Injectable()
export class SellerService {
  constructor(private prismaService: PrismaService) {}

  async create(createSellerDto: CreateSellerDto) {
    return this.prismaService.seller.create({ data: { ...createSellerDto } });
  }

  async findAll() {
    return this.prismaService.seller.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.seller.findUnique({ where: { id } });
  }

  async findByUserId(userId: string) {
    return this.prismaService.seller.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async update(id: string, data: any) {
    return this.prismaService.seller.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prismaService.seller.delete({ where: { id } });
  }

  // Get profit summary for seller
  async getProfitSummary(sellerId: string): Promise<{
    totalSales: number;
    totalEarnings: number;
    profitByTier: { [key in SellerTier]: number };
    currentTier: SellerTier;
    orderCount: number;
  }> {
    const seller = await this.prismaService.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // Get all delivered orders for this seller
    const orders = await this.prismaService.order.findMany({
      where: {
        product: { sellerId },
        status: 'DELIVERED',
      },
      include: {
        product: true,
      },
    });

    // Calculate profit by tier
    const profitByTier: { [key in SellerTier]: number } = {
      SEED: 0,
      SPROUT: 0,
      GROWTH: 0,
      BLOOM: 0,
      EVERGREEN: 0,
      EARTH_GUARDIAN: 0,
    };

    let totalEarnings = 0;

    // Get all profit transactions for this seller
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        userId: seller.userId,
        type: 'CREDIT',
        referenceType: 'ORDER_DELIVERY',
      },
    });

    transactions.forEach((tx) => {
      totalEarnings += Number(tx.amount);
    });

    // Calculate current tier earnings (simplified - would need more detail per tier)
    profitByTier[seller.tier] = totalEarnings;

    return {
      totalSales: Number(seller.totalSales),
      totalEarnings,
      profitByTier,
      currentTier: seller.tier,
      orderCount: orders.length,
    };
  }

  // Get earnings summary for a specific period
  async getEarningsSummary(
    sellerId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalEarnings: number;
    totalOrders: number;
    averageOrderValue: number;
    transactions: any[];
  }> {
    const seller = await this.prismaService.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    const where: any = {
      userId: seller.userId,
      type: 'CREDIT',
      referenceType: 'ORDER_DELIVERY',
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const transactions = await this.prismaService.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const totalEarnings = transactions.reduce(
      (sum, tx) => sum + Number(tx.amount),
      0,
    );
    const totalOrders = transactions.length;
    const averageOrderValue = totalOrders > 0 ? totalEarnings / totalOrders : 0;

    return {
      totalEarnings,
      totalOrders,
      averageOrderValue,
      transactions,
    };
  }
}
