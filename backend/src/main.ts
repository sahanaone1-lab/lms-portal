import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const frontendUrl = process.env.FRONTEND_URL;
  app.enableCors({
    origin: (origin: any, callback: any) => {
      if (
        !origin ||
        origin.indexOf('localhost') !== -1 ||
        origin.indexOf('127.0.0.1') !== -1 ||
        origin.indexOf('[::1]') !== -1 ||
        (frontendUrl && origin === frontendUrl)
      ) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  console.log('Current __dirname:', __dirname);
  console.log('Uploads path:', join(process.cwd(), 'uploads'));
  console.log('Uploads exists:', require('fs').existsSync(join(process.cwd(), 'uploads')));
  await app.listen(port);
  console.log(`Backend server listening on port ${port}`);
}
bootstrap();
