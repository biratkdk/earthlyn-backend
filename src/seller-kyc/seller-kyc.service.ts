import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class SellerKycService {
  constructor(private prisma: PrismaService) {}

  async submitKyc(userId: string, kycData: any) {
    return await this.prisma.seller.update({
      where: { userId },
      data: {
        kycStatus: "PENDING",
        kycDocuments: JSON.stringify(kycData),
      },
    });
  }

  async getPendingKyc() {
    return await this.prisma.seller.findMany({
      where: { kycStatus: "PENDING" },
      include: { user: true },
    });
  }

  async approveKyc(userId: string) {
    return await this.prisma.seller.update({
      where: { userId },
      data: { kycStatus: "APPROVED", verifiedAt: new Date() },
    });
  }

  async rejectKyc(userId: string, reason: string) {
    return await this.prisma.seller.update({
      where: { userId },
      data: { kycStatus: "REJECTED", rejectionReason: reason },
    });
  }

  async getKycStatus(userId: string) {
    return await this.prisma.seller.findUnique({
      where: { userId },
      select: { kycStatus: true, verifiedAt: true },
    });
  }
}
