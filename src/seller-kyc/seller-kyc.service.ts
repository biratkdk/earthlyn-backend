import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { SubmitKycDto } from "./dto/submit-kyc.dto";

@Injectable()
export class SellerKycService {
  constructor(private prisma: PrismaService) {}

  async submitKycDocuments(userId: string, dto: SubmitKycDto) {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });
    if (!seller) throw new Error('Seller not found');

    await this.prisma.$transaction(async (tx) => {
      for (const doc of dto.documents) {
        await tx.sellerKycDocument.create({
          data: {
            sellerId: seller.id,
            docType: doc.docType,
            url: doc.url,
            status: 'PENDING',
          },
        });
      }

      await tx.seller.update({
        where: { id: seller.id },
        data: { kycStatus: "PENDING" },
      });
    });

    return { submitted: true, count: dto.documents.length };
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
