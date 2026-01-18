import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateSellerDto {
  @IsString()
  @IsOptional()
  storeDescription?: string;

  @IsNumber()
  @IsOptional()
  processingFee?: number;
}
