import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {}

  async sendOrderConfirmation(
    to: string,
    orderId: string,
    productName: string,
    totalAmount: number,
    quantity: number,
  ): Promise<void> {
    const subject = `Order Confirmation - Order #${orderId}`;
    const htmlContent = `
      <h1>Order Confirmed!</h1>
      <p>Thank you for your purchase.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Product:</strong> ${productName}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
      <p>Your order will be processed shortly.</p>
    `;

    await this.send(to, subject, htmlContent);
  }

  async sendOrderShipped(
    to: string,
    orderId: string,
    trackingId: string,
  ): Promise<void> {
    const subject = `Order Shipped - Order #${orderId}`;
    const htmlContent = `
      <h1>Your Order Has Shipped!</h1>
      <p>Your order is on its way.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Tracking ID:</strong> ${trackingId}</p>
      <p>You can track your package using the tracking ID above.</p>
    `;

    await this.send(to, subject, htmlContent);
  }

  async sendOrderDelivered(
    to: string,
    orderId: string,
    rewardPoints: number,
  ): Promise<void> {
    const subject = `Order Delivered - Order #${orderId}`;
    const htmlContent = `
      <h1>Order Delivered!</h1>
      <p>Your order has been successfully delivered.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Reward Points Earned:</strong> ${rewardPoints}</p>
      <p>Thank you for shopping with us!</p>
    `;

    await this.send(to, subject, htmlContent);
  }

  async sendDisputeOpened(
    to: string,
    disputeId: string,
    orderId: string,
    reason: string,
  ): Promise<void> {
    const subject = `Dispute Opened - Dispute #${disputeId}`;
    const htmlContent = `
      <h1>Dispute Has Been Opened</h1>
      <p><strong>Dispute ID:</strong> ${disputeId}</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Our team will review your dispute and respond shortly.</p>
    `;

    await this.send(to, subject, htmlContent);
  }

  async sendDisputeResolved(
    to: string,
    disputeId: string,
    resolution: string,
  ): Promise<void> {
    const subject = `Dispute Resolved - Dispute #${disputeId}`;
    const htmlContent = `
      <h1>Your Dispute Has Been Resolved</h1>
      <p><strong>Dispute ID:</strong> ${disputeId}</p>
      <p><strong>Resolution:</strong> ${resolution}</p>
      <p>Thank you for your patience.</p>
    `;

    await this.send(to, subject, htmlContent);
  }

  async sendWelcome(to: string, name: string): Promise<void> {
    const subject = 'Welcome to EARTHLYN!';
    const htmlContent = `
      <h1>Welcome to EARTHLYN, ${name}!</h1>
      <p>Thank you for joining our eco-friendly marketplace.</p>
      <p>We're excited to have you be part of our community.</p>
    `;

    await this.send(to, subject, htmlContent);
  }

  async sendPasswordReset(to: string, resetLink: string): Promise<void> {
    const subject = 'Password Reset Request';
    const htmlContent = `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
    `;

    await this.send(to, subject, htmlContent);
  }

  private async send(to: string, subject: string, htmlContent: string): Promise<void> {
    try {
      // TODO: Implement SendGrid integration
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
      // await sgMail.send({
      //   to,
      //   from: this.configService.get<string>('SENDGRID_FROM_EMAIL'),
      //   subject,
      //   html: htmlContent,
      // });

      // For now, log emails to console
      this.logger.log(`[EMAIL SENT] To: ${to}, Subject: ${subject}`);
      this.logger.debug(`Content:\n${htmlContent}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }
}
