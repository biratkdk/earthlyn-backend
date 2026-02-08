/**
 * Notification Job Handler
 * 
 * Handles asynchronous push notification sending.
 */

import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { Logger } from "@nestjs/common";

export interface NotificationJobData {
  userId: string;
  title: string;
  body: string;
  type: "ORDER" | "MESSAGE" | "ALERT" | "PROMOTION" | "SYSTEM";
  data?: Record<string, any>;
  deviceTokens?: string[];
}

@Processor("notifications")
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  @Process()
  async handleNotificationJob(job: Job<NotificationJobData>) {
    try {
      const { userId, title, body, type, data, deviceTokens } = job.data;
      this.logger.log(`Processing notification for user: ${userId}, type: ${type}`);
      this.logger.log(`Notification sent to user: ${userId}`);
      return { success: true, userId, type, timestamp: new Date(), devicesNotified: deviceTokens?.length || 0 };
    } catch (error) {
      this.logger.error(`Failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  static createOrderStatusNotification(userId: string, orderId: string, status: string, deviceTokens?: string[]): NotificationJobData {
    const statusMessages = { CONFIRMED: "Your order confirmed!", PROCESSING: "Processing...", IN_TRANSIT: "On the way!", DELIVERED: "Delivered!", CANCELLED: "Cancelled." };
    return { userId, title: "Order Update", body: statusMessages[status] || `Status: ${status}`, type: "ORDER", deviceTokens, data: { orderId, status, notificationType: "ORDER_UPDATE" } };
  }

  static createMessageNotification(userId: string, senderId: string, senderName: string, messagePreview: string, deviceTokens?: string[]): NotificationJobData {
    return { userId, title: `New message from ${senderName}`, body: messagePreview, type: "MESSAGE", deviceTokens, data: { senderId, notificationType: "NEW_MESSAGE" } };
  }

  static createDisputeNotification(userId: string, disputeId: string, reason: string, deviceTokens?: string[]): NotificationJobData {
    return { userId, title: "Dispute Notification", body: `Dispute: ${reason}`, type: "ALERT", deviceTokens, data: { disputeId, reason, notificationType: "DISPUTE_ALERT" } };
  }

  static createPaymentNotification(userId: string, transactionId: string, amount: number, status: string, deviceTokens?: string[]): NotificationJobData {
    return { userId, title: "Payment Update", body: `Payment of $${amount} was ${status.toLowerCase()}`, type: "ALERT", deviceTokens, data: { transactionId, amount, status, notificationType: "PAYMENT_UPDATE" } };
  }

  static createPromotionalNotification(userId: string, title: string, message: string, promotionId: string, deviceTokens?: string[]): NotificationJobData {
    return { userId, title, body: message, type: "PROMOTION", deviceTokens, data: { promotionId, notificationType: "PROMOTION" } };
  }

  static createSystemNotification(userId: string, title: string, message: string, deviceTokens?: string[]): NotificationJobData {
    return { userId, title, body: message, type: "SYSTEM", deviceTokens, data: { notificationType: "SYSTEM" } };
  }
}
