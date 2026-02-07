import { IsString } from 'class-validator';

export class CreateReferralDto {
  @IsString()
  refereeId: string;
}
