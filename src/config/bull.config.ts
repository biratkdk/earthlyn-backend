/**
 * Bull Queue Configuration
 * 
 * This module configures Bull Queue with Redis connection settings
 * and default job options for async processing.
 */

import { ConfigService } from "@nestjs/config";
import { BullModuleOptions } from "@nestjs/bull";

export const getBullConfig = (configService: ConfigService): BullModuleOptions => {
  const redisHost = configService.get<string>("REDIS_HOST", "localhost");
  const redisPort = configService.get<number>("REDIS_PORT", 6379);
  const redisPassword = configService.get<string>("REDIS_PASSWORD");

  const redisConfig = {
    host: redisHost,
    port: redisPort,
    ...(redisPassword && { password: redisPassword }),
  };

  return {
    redis: redisConfig,
    defaultJobOptions: {
      // Job retry attempts - 3 retries total
      attempts: 3,
      // Exponential backoff strategy
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      // Job timeout - 30 minutes max
      timeout: 30 * 60 * 1000,
      // Remove completed job after 1 hour
      removeOnComplete: {
        age: 3600,
      },
      // Remove failed job after 24 hours
      removeOnFail: {
        age: 86400,
      },
    },
  };
};
