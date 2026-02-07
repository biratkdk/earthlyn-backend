import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { json } from "express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.use(
    json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );
  
  const corsOrigin = process.env.CORS_ORIGIN || "*";
  app.enableCors({
    origin: corsOrigin === "*" ? true : corsOrigin,
    credentials: corsOrigin !== "*",
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
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`? API running on port ${port}`);
  console.log(`? Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap().catch(err => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
