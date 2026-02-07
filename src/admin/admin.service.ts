import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ManageBalanceDto } from './dto/manage-balance.dto';
import { TransactionType, ApprovalStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const totalOrders = await this.prisma.order.count();
    const totalSellers = await this.prisma.seller.count();
    const totalTransactions = await this.prisma.transaction.count();

    return {
      totalUsers,
      totalOrders,
      totalSellers,
      totalTransactions,
    };
  }

  async getUserList(skip = 0, take = 10) {
    return this.prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async approveSeller(adminId: string, sellerId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
    });
    if (!seller) throw new NotFoundException('Seller not found');

    const updated = await this.prisma.seller.update({
      where: { id: sellerId },
      data: { kycStatus: 'APPROVED' as any },
    });

    await this.prisma.adminAudit.create({
      data: {
        adminId,
        action: 'APPROVE_SELLER',
        entityType: 'SELLER',
        entityId: sellerId,
        metadata: { kycStatus: 'APPROVED' },
      },
    });

    return updated;
  }

  async manageBalance(adminId: string, manageBalanceDto: ManageBalanceDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: manageBalanceDto.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const newBalance = manageBalanceDto.type === 'CREDIT' 
      ? Number(user.balance) + manageBalanceDto.amount 
      : Number(user.balance) - manageBalanceDto.amount;

    const transaction = await this.prisma.transaction.create({
      data: {
        userId: manageBalanceDto.userId,
        amount: manageBalanceDto.amount,
        type: manageBalanceDto.type,
        description: manageBalanceDto.reason,
        referenceType: 'ADMIN_BALANCE_ADJUSTMENT',
        referenceId: manageBalanceDto.userId,
      },
    });

    await this.prisma.user.update({
      where: { id: manageBalanceDto.userId },
      data: { balance: newBalance },
    });

    await this.prisma.adminAudit.create({
      data: {
        adminId,
        action: 'MANAGE_BALANCE',
        entityType: 'USER',
        entityId: manageBalanceDto.userId,
        metadata: {
          type: manageBalanceDto.type,
          amount: manageBalanceDto.amount,
          reason: manageBalanceDto.reason,
        },
      },
    });

    return transaction;
  }
}
