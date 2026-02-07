import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateSubscriptionDto) {
    return this.prisma.subscription.create({
      data: {
        userId,
        plan: dto.plan,
        status: 'ACTIVE',
      },
    });
  }

  async cancel(userId: string, id: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { id } });
    if (!sub || sub.userId !== userId) {
      throw new Error('Not authorized');
    }
    return this.prisma.subscription.update({
      where: { id },
      data: { status: 'CANCELLED', endsAt: new Date() },
    });
  }

  async mine(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
