import { Controller, Post, Get, Body, Param, UseGuards, Request } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentIntentDto } from "./dto/create-payment-intent.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";

@Controller("payments")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("create-intent")
  @UseGuards(JwtAuthGuard)
  async createPaymentIntent(
    @Request() req,
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    return await this.paymentService.createPaymentIntent(
      createPaymentIntentDto,
      req.user.id,
    );
  }

  @Get(":paymentIntentId/status")
  @UseGuards(JwtAuthGuard)
  async getPaymentStatus(@Param("paymentIntentId") paymentIntentId: string) {
    return await this.paymentService.getPaymentIntentStatus(paymentIntentId);
  }

  @Post(":paymentIntentId/confirm")
  @UseGuards(JwtAuthGuard)
  async confirmPayment(@Param("paymentIntentId") paymentIntentId: string) {
    return await this.paymentService.confirmPaymentIntent(paymentIntentId);
  }

  @Post(":paymentIntentId/refund")
  @UseGuards(JwtAuthGuard)
  async refundPayment(
    @Param("paymentIntentId") paymentIntentId: string,
    @Body("amount") amount?: number,
  ) {
    return await this.paymentService.refundPayment(paymentIntentId, amount);
  }
}
