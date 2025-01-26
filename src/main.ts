import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const { APP_PORT, APP_HOST, ACCESS_CONTROL_ALLOW_ORIGIN } = process.env;

(async () => {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ACCESS_CONTROL_ALLOW_ORIGIN,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('eTabletka Backend')
    .setDescription('The eTabletka backend API description')
    .setVersion('1.0')
    .addTag('eTabletka')
    .build();

  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));

  await app.listen(APP_PORT, APP_HOST);
})().catch(console.error);
