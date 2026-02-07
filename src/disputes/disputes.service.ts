import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { UserRole } from '../common/decorators/roles.decorator';

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.dispute.create({
      data: {
        orderId: dto.orderId,
        openedById: userId,
        reason: dto.reason,
      },
    });
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

  async update(disputeId: string, dto: UpdateDisputeDto) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
    });
    if (!dispute) throw new NotFoundException('Dispute not found');

    return this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: dto.status ?? dispute.status,
        resolution: dto.resolution ?? dispute.resolution,
        assignedToId: dto.assignedToId ?? dispute.assignedToId,
      },
    });
  }
}
