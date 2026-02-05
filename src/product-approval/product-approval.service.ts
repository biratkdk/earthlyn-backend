import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class ProductApprovalService {
  constructor(private prisma: PrismaService) {}

  async getPendingProducts(skip: number = 0, take: number = 10) {
    return await this.prisma.product.findMany({
      where: { approvalStatus: "PENDING" },
      include: { seller: true },
      skip,
      take,
    });
  }

  async getApprovedProducts(skip: number = 0, take: number = 10) {
    return await this.prisma.product.findMany({
      where: { approvalStatus: "APPROVED" },
      include: { seller: true },
      skip,
      take,
    });
  }

  async getRejectedProducts(skip: number = 0, take: number = 10) {
    return await this.prisma.product.findMany({
      where: { approvalStatus: "REJECTED" },
      include: { seller: true },
      skip,
      take,
    });
  }

  async approveProduct(productId: string) {
    return await this.prisma.product.update({
      where: { id: productId },
      data: { approvalStatus: "APPROVED", approvedAt: new Date() },
    });
  }

  async rejectProduct(productId: string, reason?: string) {
    return await this.prisma.product.update({
      where: { id: productId },
      data: { approvalStatus: "REJECTED" },
    });
  }

  async getProductStats() {
    return {
      pending: await this.prisma.product.count({ where: { approvalStatus: "PENDING" } }),
      approved: await this.prisma.product.count({ where: { approvalStatus: "APPROVED" } }),
      rejected: await this.prisma.product.count({ where: { approvalStatus: "REJECTED" } }),
      total: await this.prisma.product.count(),
    };
  }
}
