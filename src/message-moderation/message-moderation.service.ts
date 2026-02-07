import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MessageModerationService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.messageModeration.findMany({
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
    return this.prisma.messageModeration.findMany({
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
  }
}
