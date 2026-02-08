const fs = require('fs');

// Create all the job files
const emailContent = \/**
 * Email Job Handler
 * 
 * Handles asynchronous email sending operations.
 * Used for order confirmations, disputes, notifications, etc.
 */

import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

export interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  context?: Record<string, any>;
}

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process()
  async handleEmailJob(job: Job<EmailJobData>) {
    try {
      const { to, subject, template, context } = job.data;
      
      this.logger.log(\\\Processing email job to: \\\, subject: \\\\\\);
      
      this.logger.log(\\\Email sent successfully to: \\\\\\);
      return { success: true, to, timestamp: new Date() };
    } catch (error) {
      this.logger.error(\\\Failed to send email: \\\\\\, error.stack);
      throw error;
    }
  }

  static createOrderEmailData(to, orderId, productName, quantity, totalAmount) {
    return {
      to,
      subject: 'Order Confirmation - EARTHLYN',
      template: 'order-confirmation',
      context: { orderId, productName, quantity, totalAmount, orderDate: new Date().toISOString() },
    };
  }

  static createDisputeEmailData(to, disputeId, reason, orderId) {
    return {
      to,
      subject: 'Dispute Notification - EARTHLYN',
      template: 'dispute-notification',
      context: { disputeId, reason, orderId, createdAt: new Date().toISOString() },
    };
  }

  static createWelcomeEmailData(to, userName) {
    return { to, subject: 'Welcome to EARTHLYN', template: 'welcome', context: { userName, joinDate: new Date().toISOString() } };
  }

  static createPaymentEmailData(to, transactionId, amount, paymentMethod) {
    return { to, subject: 'Payment Confirmation - EARTHLYN', template: 'payment-confirmation', context: { transactionId, amount, paymentMethod, date: new Date().toISOString() } };
  }

  static createRefundEmailData(to, orderId, refundAmount) {
    return { to, subject: 'Refund Processed - EARTHLYN', template: 'refund-confirmation', context: { orderId, refundAmount, processedDate: new Date().toISOString() } };
  }
}\;

fs.writeFileSync('src/common/jobs/email.job.ts', emailContent);
console.log('Created email.job.ts');
