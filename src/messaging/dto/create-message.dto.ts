import { IsString, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  senderId: string;

  @IsUUID()
  receiverId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content: string;
}