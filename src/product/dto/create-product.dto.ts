import { IsString, IsNumber, IsInt, IsOptional, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsString()
  category: string;

  @IsNumber()
  price: number;

  @IsNumber()
  processingFee: number;

  @IsInt()
  @IsOptional()
  stock?: number;

  @IsInt()
  @IsOptional()
  ecoScore?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
