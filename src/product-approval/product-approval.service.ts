import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class ProductApprovalService {
  constructor(private prisma: PrismaService) {}

  async getPendingProducts() {
    return await this.prisma.product.findMany({
      where: { approvalStatus: "PENDING" },
      include: { seller: true },
    });
  }

  async approveProduct(productId: string) {
    return await this.prisma.product.update({
      where: { id: productId },
      data: { approvalStatus: "APPROVED" },
    });
  }

  async rejectProduct(productId: string, reason: string) {
    return await this.prisma.product.update({
      where: { id: productId },
      data: { approvalStatus: "REJECTED", rejectionReason: reason },
    });
  }

  async getApprovedProducts() {
    return await this.prisma.product.findMany({
      where: { approvalStatus: "APPROVED" },
    });
  }
}
