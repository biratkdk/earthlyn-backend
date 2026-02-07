import { Controller, Post, Get, Body, Param, UseGuards, Request, Req } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentIntentDto } from "./dto/create-payment-intent.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { Roles, UserRole } from "../common/decorators/roles.decorator";

@Controller("payments")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("create-intent")
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.BUYER, UserRole.ADMIN)
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
  @Roles(UserRole.BUYER, UserRole.ADMIN)
  async getPaymentStatus(@Param("paymentIntentId") paymentIntentId: string) {
    return await this.paymentService.getPaymentIntentStatus(paymentIntentId);
  }

  @Post(":paymentIntentId/confirm")
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.BUYER, UserRole.ADMIN)
  async confirmPayment(@Param("paymentIntentId") paymentIntentId: string) {
    return await this.paymentService.confirmPaymentIntent(paymentIntentId);
  }

  @Post(":paymentIntentId/refund")
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.BUYER, UserRole.ADMIN)
  async refundPayment(
    @Param("paymentIntentId") paymentIntentId: string,
    @Body("amount") amount?: number,
  ) {
    return await this.paymentService.refundPayment(paymentIntentId, amount);
  }

  @Post("webhook")
  async webhook(@Req() req: any) {
    const signature = req.headers["stripe-signature"];
    return this.paymentService.handleWebhook(req.rawBody, signature);
  }
}
