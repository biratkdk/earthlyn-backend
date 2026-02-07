import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { decryptText, getEncryptionKey } from '../common/utils/crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageModerationService {
  private encryptionKey: Buffer;

  constructor(private prisma: PrismaService, private configService: ConfigService) {
    const rawKey = this.configService.get<string>('MESSAGE_ENCRYPTION_KEY');
    if (!rawKey) {
      throw new Error('MESSAGE_ENCRYPTION_KEY is not configured');
    }
    this.encryptionKey = getEncryptionKey(rawKey);
  }

  async flagMessage(flaggedById: string, messageId: string, reason: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) throw new NotFoundException('Message not found');

    return this.prisma.messageModeration.create({
      data: {
        messageId,
        flaggedById,
        reason,
        status: 'FLAGGED',
      },
      include: {
        message: true,
        flaggedBy: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async getFlaggedMessages() {
    const flags = await this.prisma.messageModeration.findMany({
      where: { status: 'FLAGGED' },
      orderBy: { createdAt: 'desc' },
      include: {
        message: {
          include: {
            sender: { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
          },
        },
        flaggedBy: { select: { id: true, name: true, email: true } },
      },
      take: 100,
    });
    return flags.map((f) => ({
      ...f,
      message: {
        ...f.message,
        content: decryptText(f.message.content, this.encryptionKey),
      },
    }));
  }

  async resolveFlag(messageId: string) {
    const moderation = await this.prisma.messageModeration.findFirst({
      where: { messageId, status: 'FLAGGED' },
      orderBy: { createdAt: 'desc' },
    });

    if (!moderation) throw new NotFoundException('Flag not found');

    return this.prisma.messageModeration.update({
      where: { id: moderation.id },
      data: { status: 'RESOLVED', resolvedAt: new Date() },
    });
  }

  async blockUser(userId: string, reason: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return {
      userId,
      blocked: true,
      reason,
      blockedAt: new Date(),
      user,
    };
  }

  async getAbuseReports() {
    const reports = await this.prisma.messageModeration.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        message: {
          include: {
            sender: { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
          },
        },
        flaggedBy: { select: { id: true, name: true, email: true } },
      },
      take: 200,
    });
    return reports.map((r) => ({
      ...r,
      message: {
        ...r.message,
        content: decryptText(r.message.content, this.encryptionKey),
      },
    }));
  }
}
