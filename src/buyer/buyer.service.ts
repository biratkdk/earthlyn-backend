import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class BuyerService {
  constructor(private prisma: PrismaService) {}

  async create(createBuyerDto: CreateBuyerDto) {
    return this.prisma.buyer.create({
      data: { userId: createBuyerDto.userId },
      include: { user: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.buyer.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.buyer.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async findAll() {
    return this.prisma.buyer.findMany({
      include: { user: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.buyer.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  async remove(id: string) {
    return this.prisma.buyer.delete({
      where: { id },
      include: { user: true },
    });
  }

  // Get buyer's current balance
  async getBalance(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return Number(user.balance);
  }

  // Deposit funds into buyer's wallet
  async depositFunds(
    userId: string,
    amount: number,
    description: string = 'Wallet deposit',
  ): Promise<{ newBalance: number; transaction: any }> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newBalance = Number(user.balance) + amount;

    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: 'CREDIT' as TransactionType,
          amount,
          description,
          referenceType: 'WALLET_DEPOSIT',
          referenceId: userId,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { balance: newBalance },
      });

      return {
        newBalance,
        transaction,
      };
    });
  }

  // Withdraw funds from buyer's wallet
  async withdrawFunds(
    userId: string,
    amount: number,
    description: string = 'Wallet withdrawal',
  ): Promise<{ newBalance: number; transaction: any }> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentBalance = Number(user.balance);
    if (currentBalance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const newBalance = currentBalance - amount;

    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: 'DEBIT' as TransactionType,
          amount,
          description,
          referenceType: 'WALLET_WITHDRAWAL',
          referenceId: userId,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { balance: newBalance },
      });

      return {
        newBalance,
        transaction,
      };
    });
  }

  // Get transaction history for buyer
  async getTransactionHistory(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<any[]> {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }
}
