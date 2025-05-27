
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { stringify } from 'json-bigint';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use((req, res, next) => {
    res.json = (data) => {
      return res.send(stringify(data));
    };
    next();
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const port = process.env.PORT || 3000;
  app.enableCors({ origin: 'http://localhost:3001' });
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('SISAR - Sistema de controle Aprova Rápido e Requalifica Rápido')
    .setDescription('Backend em NestJS para aplicação SISAR.',)
    .setVersion('versão 1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
  console.log("API SISAR rodando em http://localhost:" + port);
  console.log("SwaggerUI rodando em http://localhost:" + port + "/api");

}
bootstrap();