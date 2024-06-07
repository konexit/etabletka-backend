import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const { APP_PORT, APP_HOST, ACCESS_CONTROL_ALLOW_ORIGIN } = process.env
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ACCESS_CONTROL_ALLOW_ORIGIN,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    }
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(APP_PORT, APP_HOST);
}
bootstrap();