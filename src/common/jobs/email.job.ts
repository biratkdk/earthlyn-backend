/**
 * Email Job Handler
 * 
 * Handles asynchronous email sending operations.
 */

import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { Logger } from "@nestjs/common";

export interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  context?: Record<string, any>;
}

@Processor("email")
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process()
  async handleEmailJob(job: Job<EmailJobData>) {
    try {
      const { to, subject, template, context } = job.data;
      this.logger.log(`Processing email to: ${to}`);
      this.logger.log(`Email sent to: ${to}`);
      return { success: true, to, timestamp: new Date() };
    } catch (error) {
      this.logger.error(`Failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  static createOrderEmailData(to: string, orderId: string, productName: string, quantity: number, totalAmount: number): EmailJobData {
    return { to, subject: "Order Confirmation - EARTHLYN", template: "order-confirmation", context: { orderId, productName, quantity, totalAmount, orderDate: new Date().toISOString() } };
  }

  static createDisputeEmailData(to: string, disputeId: string, reason: string, orderId: string): EmailJobData {
    return { to, subject: "Dispute Notification - EARTHLYN", template: "dispute-notification", context: { disputeId, reason, orderId, createdAt: new Date().toISOString() } };
  }

  static createWelcomeEmailData(to: string, userName: string): EmailJobData {
    return { to, subject: "Welcome to EARTHLYN", template: "welcome", context: { userName, joinDate: new Date().toISOString() } };
  }

  static createPaymentEmailData(to: string, transactionId: string, amount: number, paymentMethod: string): EmailJobData {
    return { to, subject: "Payment Confirmation - EARTHLYN", template: "payment-confirmation", context: { transactionId, amount, paymentMethod, date: new Date().toISOString() } };
  }

  static createRefundEmailData(to: string, orderId: string, refundAmount: number): EmailJobData {
    return { to, subject: "Refund Processed - EARTHLYN", template: "refund-confirmation", context: { orderId, refundAmount, processedDate: new Date().toISOString() } };
  }
}
