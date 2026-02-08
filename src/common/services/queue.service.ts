/**
 * Queue Service
 * 
 * Central service for adding jobs to Bull queues.
 * Provides type-safe methods for job queuing.
 */

import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { EmailJobData } from "../jobs/email.job";
import { NotificationJobData } from "../jobs/notification.job";

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue("email") private emailQueue: Queue<EmailJobData>,
    @InjectQueue("notifications") private notificationQueue: Queue<NotificationJobData>
  ) {}

  // Email queue methods
  async addEmailJob(data: EmailJobData, options?: any) {
    return this.emailQueue.add(data, { ...options });
  }

  async addOrderConfirmationEmail(to: string, orderId: string, productName: string, quantity: number, totalAmount: number) {
    const data = {
      to,
      subject: "Order Confirmation - EARTHLYN",
      template: "order-confirmation",
      context: { orderId, productName, quantity, totalAmount, orderDate: new Date().toISOString() }
    };
    return this.addEmailJob(data);
  }

  async addDisputeNotificationEmail(to: string, disputeId: string, reason: string, orderId: string) {
    const data = {
      to,
      subject: "Dispute Notification - EARTHLYN",
      template: "dispute-notification",
      context: { disputeId, reason, orderId, createdAt: new Date().toISOString() }
    };
    return this.addEmailJob(data);
  }

  async addWelcomeEmail(to: string, userName: string) {
    const data = {
      to,
      subject: "Welcome to EARTHLYN",
      template: "welcome",
      context: { userName, joinDate: new Date().toISOString() }
    };
    return this.addEmailJob(data);
  }

  async addPaymentConfirmationEmail(to: string, transactionId: string, amount: number, paymentMethod: string) {
    const data = {
      to,
      subject: "Payment Confirmation - EARTHLYN",
      template: "payment-confirmation",
      context: { transactionId, amount, paymentMethod, date: new Date().toISOString() }
    };
    return this.addEmailJob(data);
  }

  async addRefundEmail(to: string, orderId: string, refundAmount: number) {
    const data = {
      to,
      subject: "Refund Processed - EARTHLYN",
      template: "refund-confirmation",
      context: { orderId, refundAmount, processedDate: new Date().toISOString() }
    };
    return this.addEmailJob(data);
  }

  // Notification queue methods
  async addNotificationJob(data: NotificationJobData, options?: any) {
    return this.notificationQueue.add(data, { ...options });
  }

  async addOrderStatusNotification(userId: string, orderId: string, status: string, deviceTokens?: string[]) {
    const data: NotificationJobData = {
      userId,
      title: "Order Update",
      body: this.getStatusMessage(status),
      type: "ORDER",
      deviceTokens,
      data: { orderId, status, notificationType: "ORDER_UPDATE" }
    };
    return this.addNotificationJob(data);
  }

  async addMessageNotification(userId: string, senderId: string, senderName: string, messagePreview: string, deviceTokens?: string[]) {
    const data: NotificationJobData = {
      userId,
      title: `New message from ${senderName}`,
      body: messagePreview,
      type: "MESSAGE",
      deviceTokens,
      data: { senderId, notificationType: "NEW_MESSAGE" }
    };
    return this.addNotificationJob(data);
  }

  async addDisputeNotification(userId: string, disputeId: string, reason: string, deviceTokens?: string[]) {
    const data: NotificationJobData = {
      userId,
      title: "Dispute Notification",
      body: `A dispute has been raised: ${reason}`,
      type: "ALERT",
      deviceTokens,
      data: { disputeId, reason, notificationType: "DISPUTE_ALERT" }
    };
    return this.addNotificationJob(data);
  }

  async addPaymentNotification(userId: string, transactionId: string, amount: number, status: string, deviceTokens?: string[]) {
    const data: NotificationJobData = {
      userId,
      title: "Payment Update",
      body: `Payment of $${amount} was ${status.toLowerCase()}`,
      type: "ALERT",
      deviceTokens,
      data: { transactionId, amount, status, notificationType: "PAYMENT_UPDATE" }
    };
    return this.addNotificationJob(data);
  }

  async addPromotionalNotification(userId: string, title: string, message: string, promotionId: string, deviceTokens?: string[]) {
    const data: NotificationJobData = {
      userId,
      title,
      body: message,
      type: "PROMOTION",
      deviceTokens,
      data: { promotionId, notificationType: "PROMOTION" }
    };
    return this.addNotificationJob(data);
  }

  private getStatusMessage(status: string): string {
    const messages = {
      CONFIRMED: "Your order has been confirmed!",
      PROCESSING: "Your order is being processed",
      IN_TRANSIT: "Your order is on the way!",
      DELIVERED: "Your order has been delivered",
      CANCELLED: "Your order has been cancelled"
    };
    return messages[status] || `Order status: ${status}`;
  }
}
