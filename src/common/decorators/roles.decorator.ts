import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  BUYER = 'buyer',
}

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
