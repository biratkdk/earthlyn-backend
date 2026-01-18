import { IsString, IsInt, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  buyerId: string;

  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
