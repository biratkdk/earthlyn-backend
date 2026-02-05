import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @Transform(({ value }) => value?.toUpperCase?.())
  @IsEnum(UserRole)
  role: UserRole;
}