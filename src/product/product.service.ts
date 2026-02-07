import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(data: any) {
    const sellerLookup = data.sellerId
      ? { id: data.sellerId }
      : { userId: data.sellerUserId };
    const seller = await this.prisma.seller.findUnique({
      where: sellerLookup,
      select: { id: true, userId: true, kycStatus: true, tier: true, isVerified: true },
    });
    if (!seller) throw new NotFoundException('Seller not found');
    if (seller.kycStatus !== 'APPROVED') {
      throw new BadRequestException('Seller KYC not approved');
    }
    const autoApprove = seller.isVerified || ['BLOOM', 'EVERGREEN', 'EARTH_GUARDIAN'].includes(seller.tier);

    const processingFeeRate =
      this.configService.get<number>('commerce.processingFeeRate') ?? 0.05;
    const computedFee = Number(data.price || 0) * processingFeeRate;
    const processingFee = Number(data.processingFee ?? computedFee);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: seller.userId },
        select: { balance: true },
      });
      if (!user) throw new NotFoundException('Seller user not found');
      if (Number(user.balance) < processingFee) {
        throw new BadRequestException('Insufficient balance for processing fee');
      }

      const product = await tx.product.create({
        data: {
          name: data.name,
          price: data.price,
          stock: data.stock,
          sellerId: seller.id,
          description: data.description || '',
          ecoScore: data.ecoScore || 0,
          category: data.category || 'other',
          processingFee,
          approvalStatus: autoApprove ? 'APPROVED' : 'PENDING',
          approvedAt: autoApprove ? new Date() : null,
        },
        include: { seller: true },
      });

      await tx.transaction.create({
        data: {
          userId: seller.userId,
          amount: processingFee,
          type: 'DEBIT',
          description: `Processing fee for product ${product.id}`,
          referenceType: 'PRODUCT_LISTING_FEE',
          referenceId: product.id,
        },
      });

      await tx.user.update({
        where: { id: seller.userId },
        data: { balance: Number(user.balance) - processingFee },
      });

      return product;
    });
  }

  async findAll(filters?: any) {
    return this.prisma.product.findMany({
      where: filters || {},
      include: { seller: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { seller: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.product.update({ where: { id }, data, include: { seller: true } });
  }

  async delete(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
