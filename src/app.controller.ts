import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

@Controller('health')
export class AppController {
  private startTime = Date.now();

  @Get()
  @HttpCode(HttpStatus.OK)
  health(): HealthResponse {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
    };
  }
}
