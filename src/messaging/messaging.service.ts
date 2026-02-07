import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConfigService } from '@nestjs/config';
import { decryptText, encryptText, getEncryptionKey } from '../common/utils/crypto';

@Injectable()
export class MessagingService {
  private encryptionKey: Buffer;

  constructor(private prisma: PrismaService, private configService: ConfigService) {
    const rawKey = this.configService.get<string>('MESSAGE_ENCRYPTION_KEY');
    if (!rawKey) {
      throw new Error('MESSAGE_ENCRYPTION_KEY is not configured');
    }
    this.encryptionKey = getEncryptionKey(rawKey);
  }

  async sendMessage(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        senderId: createMessageDto.senderId,
        receiverId: createMessageDto.receiverId,
        content: encryptText(createMessageDto.content, this.encryptionKey),
      },
    });
  }

  async getConversation(userId: string, otherUserId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
    return messages.map((m) => ({
      ...m,
      content: decryptText(m.content, this.encryptionKey),
    }));
  }

  async getUserConversations(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const conversationMap = new Map();
    messages.forEach((message) => {
      const otherUserId =
        message.senderId === userId ? message.receiverId : message.senderId;
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          ...message,
          content: decryptText(message.content, this.encryptionKey),
        });
      }
    });

    return Array.from(conversationMap.values());
  }

  async markAsRead(messageId: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }
}
