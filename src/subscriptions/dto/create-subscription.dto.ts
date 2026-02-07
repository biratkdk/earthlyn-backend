import { IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  plan: string;
}
