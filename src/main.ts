import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@m8a/nestjs-typegoose';
import * as express from 'express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
 

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
 
 const logger = new Logger('Bootstrap');
 logger.log('cors URL', process.env.CLIENT_URL)
  app.setGlobalPrefix('api');
  const connection = app.get<Connection>(getConnectionToken());
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With'
  });
  connection.once('open', () => {
    console.log('MongoDB connected!');
    console.log('port:', app.getHttpServer().address().port);
  });
  connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  const config = new DocumentBuilder()
    .setTitle('Project API')
    .setDescription('Документация API для проекта')
    .setVersion('1.0')
    .addTag('angular', 'Примеры эндпоинтов')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
