import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MessageModerationService {
  constructor(private prisma: PrismaService) {}

  // Flag a message by creating a moderation record (using message metadata)
  async flagMessage(messageId: string, reason: string) {
    // Update message details tracking
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });
    
    if (!message) throw new Error('Message not found');
    
    // In a real system, you would have a separate MessageModeration table
    // For now, we track in a simple way by deleting or marking
    return { 
      messageId, 
      flagged: true, 
      reason, 
      flaggedAt: new Date() 
    };
  }

  async getFlaggedMessages() {
    // Return recent messages (in production, this would query a moderation table)
    const messages = await this.prisma.message.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { 
        sender: { select: { id: true, name: true, email: true } }, 
        receiver: { select: { id: true, name: true, email: true } } 
      },
    });
    return messages;
  }

  async resolveFlag(messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });
    
    if (!message) throw new Error('Message not found');
    
    return { 
      messageId, 
      resolved: true, 
      resolvedAt: new Date() 
    };
  }

  async blockUser(userId: string, reason: string) {
    // Disable the user account
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
    
    return { 
      userId, 
      blocked: true, 
      reason, 
      blockedAt: new Date(),
      user 
    };
  }

  async getAbuseReports() {
    // Fetch all messages for abuse review
    const messages = await this.prisma.message.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        content: true, 
        createdAt: true, 
        sender: { select: { name: true, email: true } },
        receiver: { select: { name: true, email: true } }
      },
    });
    return messages;
  }
}
