import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { json } from "express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );
  
  const corsOrigin = (process.env.CORS_ORIGIN || "*").trim();
  const allowAll = corsOrigin === "*";
  const allowedOrigins = allowAll
    ? []
    : corsOrigin
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
  app.enableCors({
    origin: allowAll
      ? true
      : (origin, callback) => {
          if (!origin) {
            return callback(null, true);
          }
          const isAllowed = allowedOrigins.includes(origin);
          return callback(isAllowed ? null : new Error("Not allowed by CORS"), isAllowed);
        },
    credentials: !allowAll,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("EARTHLYN Backend API")
    .setDescription("E-commerce API for sustainable products")
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
  
  const port = parseInt(process.env.PORT || '10000', 10);
  await app.listen(port);
  console.log(`API running on port ${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

bootstrap().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});

