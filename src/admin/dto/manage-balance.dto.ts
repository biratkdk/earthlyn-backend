import { IsNumber, IsString, IsEnum } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class ManageBalanceDto {
  @IsString()
  userId: string;

  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  reason?: string;
}
