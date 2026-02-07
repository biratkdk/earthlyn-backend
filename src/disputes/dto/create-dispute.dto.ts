import { IsString } from 'class-validator';

export class CreateDisputeDto {
  @IsString()
  orderId: string;

  @IsString()
  reason: string;
}
