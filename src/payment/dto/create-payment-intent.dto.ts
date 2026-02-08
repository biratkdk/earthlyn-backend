import { IsNumber, IsArray, IsObject, IsString, IsOptional, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsArray()
  @IsOptional()
  items?: any[];

  @IsObject()
  shippingAddress: any;

  @IsString()
  @IsOptional()
  orderId?: string;
}