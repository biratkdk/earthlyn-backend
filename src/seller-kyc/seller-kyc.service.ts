import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class SellerKycService {
  constructor(private prisma: PrismaService) {}

  async submitKycDocuments(userId: string, documents: any) {
    return await this.prisma.seller.update({
      where: { userId },
      data: { kycStatus: "PENDING" },
    });
  }

  async getKycStatus(userId: string) {
    return await this.prisma.seller.findUnique({
      where: { userId },
      select: { kycStatus: true, isVerified: true },
    });
  }

  async getPendingKycRequests() {
    return await this.prisma.seller.findMany({
      where: { kycStatus: "PENDING" },
      include: { user: true },
    });
  }

  async approveKyc(sellerId: string) {
    return await this.prisma.seller.update({
      where: { id: sellerId },
      data: { kycStatus: "APPROVED", isVerified: true },
    });
  }

  async rejectKyc(sellerId: string, reason?: string) {
    return await this.prisma.seller.update({
      where: { id: sellerId },
      data: { kycStatus: "REJECTED", isVerified: false },
    });
  }
}
