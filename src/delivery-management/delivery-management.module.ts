import { Module } from '@nestjs/common';
import { DeliveryManagementService } from './delivery-management.service';
import { DeliveryManagementController } from './delivery-management.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [DeliveryManagementService],
  controllers: [DeliveryManagementController],
})
export class DeliveryManagementModule {}
