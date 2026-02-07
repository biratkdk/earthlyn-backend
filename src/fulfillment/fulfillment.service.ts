import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../database/prisma.service';
import { DeliveryStatus } from '@prisma/client';

@Injectable()
export class FulfillmentService {
  constructor(private prisma: PrismaService) {}

  @Cron('0 * * * *') // hourly
  async autoAdvance() {
    if (process.env.AUTO_FULFILL !== 'true') return;

    const stepHours = Number(process.env.AUTO_FULFILL_STEP_HOURS || 24);
    const now = new Date();
    const processingCutoff = new Date(now.getTime() - stepHours * 60 * 60 * 1000);
    const shippedCutoff = new Date(now.getTime() - stepHours * 2 * 60 * 60 * 1000);

    const processingOrders = await this.prisma.order.findMany({
      where: { status: 'PROCESSING', paymentStatus: 'SUCCEEDED', createdAt: { lte: processingCutoff } },
      include: { product: true },
    });

    for (const order of processingOrders) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'SHIPPED' },
      });
      await this.prisma.product.update({
        where: { id: order.productId },
        data: { deliveryStatus: DeliveryStatus.IN_TRANSIT },
      });
    }

    const shippedOrders = await this.prisma.order.findMany({
      where: { status: 'SHIPPED', paymentStatus: 'SUCCEEDED', createdAt: { lte: shippedCutoff } },
      include: { product: true },
    });

    for (const order of shippedOrders) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'DELIVERED', deliveredAt: new Date() },
      });
      await this.prisma.product.update({
        where: { id: order.productId },
        data: { deliveryStatus: DeliveryStatus.DELIVERED },
      });
    }
  }
}
