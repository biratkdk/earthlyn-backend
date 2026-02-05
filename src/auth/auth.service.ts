import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly VALID_ROLES = ['ADMIN', 'SELLER', 'BUYER', 'CUSTOMER_SERVICE'];

  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: registerDto.email },
    });
    if (existingUser) throw new ConflictException('User already exists');

    // Validate and normalize role
    const normalizedRole = registerDto.role?.toUpperCase().trim();
    if (!normalizedRole || !this.VALID_ROLES.includes(normalizedRole)) {
      throw new BadRequestException('Invalid role. Must be one of: ADMIN, SELLER, BUYER, CUSTOMER_SERVICE');
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      this.configService.get<number>('bcrypt.rounds') || 10,
    );

    const user = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        name: registerDto.name,
        passwordHash: hashedPassword,
        role: normalizedRole as UserRole,
      },
    });

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user || !(await bcrypt.compare(loginDto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateUser(userId: string) {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }
}