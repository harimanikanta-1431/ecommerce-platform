import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Angular Admin + Next.js Frontend
  app.enableCors({
    origin: [
      'http://localhost:4200', // Angular Admin
      'http://localhost:3000', // Next.js Frontend
      'http://localhost:3001',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('VistaMart Ecommerce API')
    .setDescription('Production-grade ecommerce API for storefront and admin')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Backend Port
  const port = Number(process.env.PORT ?? 3001);

  await app.listen(port);

  console.log(
    `🚀 Backend API running on: http://localhost:${port}`,
  );
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application', error);
  process.exit(1);
});
