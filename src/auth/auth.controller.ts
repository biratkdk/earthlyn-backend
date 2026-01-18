import { Controller, Post, Body, Get, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    if (!registerDto.email || !registerDto.password || !registerDto.role) {
      throw new BadRequestException('Missing required fields');
    }
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException('Email and password required');
    }
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validate(@CurrentUser() user: any) {
    return this.authService.validateUser(user.id);
  }
}
