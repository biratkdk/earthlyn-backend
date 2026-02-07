import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateReferralDto } from './dto/create-referral.dto';

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async create(referrerId: string, dto: CreateReferralDto) {
    return this.prisma.referral.create({
      data: {
        referrerId,
        refereeId: dto.refereeId,
      },
    });
  }

  async mine(userId: string) {
    return this.prisma.referral.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
