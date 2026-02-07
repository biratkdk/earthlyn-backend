import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { CreatePaymentIntentDto } from "./dto/create-payment-intent.dto";

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
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
      const { amount, items, shippingAddress } = createPaymentIntentDto;

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          userId,
          itemCount: items.length,
          products: JSON.stringify(items),
          shippingAddress: JSON.stringify(shippingAddress),
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
}
