import { Module } from '@nestjs/common';
import { FulfillmentService } from './fulfillment.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [FulfillmentService],
})
export class FulfillmentModule {}
