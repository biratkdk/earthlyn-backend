import { IsOptional, IsString } from 'class-validator';
import { DisputeStatus } from '@prisma/client';

export class UpdateDisputeDto {
  @IsOptional()
  @IsString()
  status?: DisputeStatus;

  @IsOptional()
  @IsString()
  resolution?: string;

  @IsOptional()
  @IsString()
  assignedToId?: string;
}
