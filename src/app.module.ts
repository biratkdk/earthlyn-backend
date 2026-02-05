import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { SellerModule } from './seller/seller.module';
import { BuyerModule } from './buyer/buyer.module';
import { AdminModule } from './admin/admin.module';
import { MessagingModule } from './messaging/messaging.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ProductApprovalModule } from './product-approval/product-approval.module';
import { SellerKycModule } from './seller-kyc/seller-kyc.module';
import { DeliveryManagementModule } from './delivery-management/delivery-management.module';
import { MessageModerationModule } from './message-moderation/message-moderation.module';
import { AnalyticsModule } from './analytics/analytics.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
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
    ProductApprovalModule,
    SellerKycModule,
    DeliveryManagementModule,
    MessageModerationModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
