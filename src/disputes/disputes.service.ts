import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { UserRole } from '../common/decorators/roles.decorator';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService, private configService: ConfigService) {}

  async create(userId: string, role: UserRole, dto: CreateDisputeDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { product: { include: { seller: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');

    const isBuyer = order.buyerId === userId;
    const isSeller = order.product?.seller?.userId === userId;
    if (!isBuyer && !isSeller && role !== UserRole.ADMIN) {
      throw new ForbiddenException('Not authorized');
    }

    const slaHours = Number(this.configService.get('DISPUTE_SLA_HOURS') || 72);
    const dueAt = new Date(Date.now() + slaHours * 60 * 60 * 1000);

    const dispute = await this.prisma.dispute.create({
      data: {
        orderId: dto.orderId,
        openedById: userId,
        reason: dto.reason,
        priority: (dto as any).priority,
        dueAt,
      },
    });

    await this.createNotification(order.buyerId, 'DISPUTE_OPENED', `Dispute opened for order ${order.id}`, { disputeId: dispute.id });
    if (order.product?.seller?.userId) {
      await this.createNotification(order.product.seller.userId, 'DISPUTE_OPENED', `Dispute opened for order ${order.id}`, { disputeId: dispute.id });
    }
    return dispute;
  }

  async myDisputes(userId: string) {
    return this.prisma.dispute.findMany({
      where: { openedById: userId },
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async list(status?: string) {
    return this.prisma.dispute.findMany({
      where: status ? { status: status as any } : undefined,
      include: { order: true, openedBy: true, assignedTo: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(disputeId: string, resolvedById: string, dto: UpdateDisputeDto) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
    });
    if (!dispute) throw new NotFoundException('Dispute not found');

    const updated = await this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: dto.status ?? dispute.status,
        resolution: dto.resolution ?? dispute.resolution,
        assignedToId: dto.assignedToId ?? dispute.assignedToId,
        resolvedAt: dto.status === 'RESOLVED' ? new Date() : dispute.resolvedAt,
        resolvedById: dto.status === 'RESOLVED' ? resolvedById : dispute.resolvedById,
      },
    });
    if (dto.status === 'RESOLVED') {
      await this.createNotification(dispute.openedById, 'DISPUTE_RESOLVED', `Dispute ${disputeId} resolved`, { disputeId });
    }
    return updated;
  }

  @Cron('*/30 * * * *') // every 30 minutes
  async markOverdue() {
    const now = new Date();
    const overdue = await this.prisma.dispute.findMany({
      where: {
        status: { in: ['OPEN', 'IN_REVIEW'] as any },
        dueAt: { lte: now },
      },
    });
    for (const d of overdue) {
      await this.createNotification(d.openedById, 'DISPUTE_OVERDUE', `Dispute ${d.id} is overdue`, { disputeId: d.id });
    }
  }

  private async createNotification(userId: string, type: string, message: string, metadata?: any) {
    await this.prisma.notification.create({
      data: { userId, type, message, metadata },
    });
  }
}
