import { IsNumber, IsArray, IsString, IsObject, IsOptional } from "class-validator";

export class CreatePaymentIntentDto {
  @IsNumber()
  amount: number;

  @IsArray()
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }>;

  @IsObject()
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
  };

  @IsString()
  @IsOptional()
  orderId?: string;
}

export class ConfirmPaymentDto {
  @IsString()
  paymentIntentId: string;

  @IsString()
  paymentMethodId: string;
}
