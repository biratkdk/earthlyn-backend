import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../database/prisma.service";
import Stripe from "stripe";
import { CreatePaymentIntentDto } from "./dto/create-payment-intent.dto";

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    const apiKey = this.configService.get<string>("STRIPE_SECRET_KEY");
    if (!apiKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    this.stripe = new Stripe(apiKey, {
      timeout: 90000,
    });
  }

  async createPaymentIntent(
    createPaymentIntentDto: CreatePaymentIntentDto,
    userId: string
  ) {
    try {
      const { amount, items, shippingAddress, orderId } = createPaymentIntentDto;

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          userId,
          itemCount: items.length,
          products: JSON.stringify(items),
          shippingAddress: JSON.stringify(shippingAddress),
          orderId: orderId || '',
        },
        description: `Order from user ${userId} with ${items.length} item(s)`,
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
      };
    } catch (error) {
      console.error(`Stripe error: ${error.message}`);
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  async confirmPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        await this.prismaUpdateOrderPayment(orderId, 'SUCCEEDED', paymentIntentId);
      }
      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error(`Stripe confirmation error: ${error.message}`);
      throw new Error(`Failed to confirm payment: ${error.message}`);
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        await this.prismaUpdateOrderPayment(orderId, 'REFUNDED', paymentIntentId);
      }
      return {
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount / 100,
      };
    } catch (error) {
      console.error(`Refund error: ${error.message}`);
      throw new Error(`Refund failed: ${error.message}`);
    }
  }

  async getPaymentIntentStatus(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      return {
        status: paymentIntent.status,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
      };
    } catch (error) {
      console.error(`Status check error: ${error.message}`);
      throw new Error(`Failed to get payment status: ${error.message}`);
    }
  }

  async handleWebhook(rawBody: Buffer, signature: string | string[]) {
    const secret = this.configService.get<string>("STRIPE_WEBHOOK_SECRET");
    if (!secret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }
    const sig = Array.isArray(signature) ? signature[0] : signature;
    const event = this.stripe.webhooks.constructEvent(rawBody, sig, secret);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const orderId = intent.metadata?.orderId;
        if (orderId) {
          await this.prismaUpdateOrderPayment(orderId, "SUCCEEDED", intent.id);
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const orderId = intent.metadata?.orderId;
        if (orderId) {
          await this.prismaUpdateOrderPayment(orderId, "FAILED", intent.id);
        }
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const intentId = charge.payment_intent?.toString();
        if (intentId) {
          const paymentIntent = await this.stripe.paymentIntents.retrieve(intentId);
          const orderId = paymentIntent.metadata?.orderId;
          if (orderId) {
            await this.prismaUpdateOrderPayment(orderId, "REFUNDED", paymentIntent.id);
          }
        }
        break;
      }
      default:
        break;
    }

    return { received: true };
  }

  private async prismaUpdateOrderPayment(
    orderId: string,
    status: 'SUCCEEDED' | 'REFUNDED' | 'FAILED',
    paymentIntentId: string,
  ) {
    try {
      await this.prismaService.order.update({
        where: { id: orderId },
        data: { paymentStatus: status, paymentIntentId },
      });
    } catch {
      // best-effort update
    }
  }
}
