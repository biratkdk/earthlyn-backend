import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { SellerModule } from './seller/seller.module';
import { BuyerModule } from './buyer/buyer.module';
import { AdminModule } from './admin/admin.module';
import { MessagingModule } from './messaging/messaging.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ProductModule } from './product/product.module';
import { ProductApprovalModule } from './product-approval/product-approval.module';
import { SellerKycModule } from './seller-kyc/seller-kyc.module';
import { DeliveryManagementModule } from './delivery-management/delivery-management.module';
import { MessageModerationModule } from './message-moderation/message-moderation.module';
import { AnalyticsModule } from './analytics/analytics.module';
import configuration from './config/configuration';
import { RolesGuard } from './common/guards/roles.guard';
import { DisputesModule } from './disputes/disputes.module';
import { ReferralsModule } from './referrals/referrals.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: Number(configService.get('THROTTLE_TTL') || 60),
        limit: Number(configService.get('THROTTLE_LIMIT') || 10),
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    SellerModule,
    BuyerModule,
    AdminModule,
    MessagingModule,
    OrderModule,
    PaymentModule,
    ProductModule,
    ProductApprovalModule,
    SellerKycModule,
    DeliveryManagementModule,
    MessageModerationModule,
    AnalyticsModule,
    DisputesModule,
    ReferralsModule,
    SubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
