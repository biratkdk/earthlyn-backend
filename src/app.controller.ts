import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

@Controller()
export class AppController {
  private startTime = Date.now();

  @Get()
  @HttpCode(HttpStatus.OK)
  root(): HealthResponse {
    return {
      status: 'EARTHLYN Backend Running',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
    };
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  health(): HealthResponse {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
    };
  }
}
