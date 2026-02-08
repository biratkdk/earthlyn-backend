import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreatePrivacySettingsDto } from "./dto/create-privacy-settings.dto";

@Injectable()
export class PrivacyService {
  constructor(private prisma: PrismaService) {}

  async getPrivacySettings(userId: string) {
    return this.prisma.privacySettings.findUnique({
      where: { userId },
    });
  }

  async updatePrivacySettings(userId: string, dto: CreatePrivacySettingsDto) {
    return this.prisma.privacySettings.upsert({
      where: { userId },
      update: {
        dataCollection: dto.dataCollection,
        marketing: dto.marketing,
        analytics: dto.analytics,
        lastUpdatedAt: new Date(),
      },
      create: {
        userId,
        dataCollection: dto.dataCollection,
        marketing: dto.marketing,
        analytics: dto.analytics,
      },
    });
  }

  async requestDataExport(userId: string) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return this.prisma.dataExportLog.create({
      data: {
        userId,
        format: "JSON",
        expiresAt,
      },
    });
  }

  async getDataExports(userId: string) {
    return this.prisma.dataExportLog.findMany({
      where: { userId },
      orderBy: { exportedAt: "desc" },
    });
  }

  async requestAccountDeletion(userId: string) {
    return this.prisma.privacySettings.upsert({
      where: { userId },
      update: {
        deletionRequested: new Date(),
      },
      create: {
        userId,
        deletionRequested: new Date(),
      },
    });
  }

  async cancelDeletionRequest(userId: string) {
    return this.prisma.privacySettings.update({
      where: { userId },
      data: {
        deletionRequested: null,
      },
    });
  }

  async getPendingDeletions(daysUntilDeletion: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysUntilDeletion);
    return this.prisma.privacySettings.findMany({
      where: {
        deletionRequested: {
          not: null,
          lte: cutoffDate,
        },
      },
      include: { user: true },
    });
  }

  async deleteUserData(userId: string) {
    await this.prisma.message.deleteMany({ where: { senderId: userId } });
    await this.prisma.ticket.deleteMany({ where: { userId } });
    await this.prisma.transaction.deleteMany({ where: { userId } });
    await this.prisma.privacySettings.update({
      where: { userId },
      data: { deletionAt: new Date() },
    });
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}