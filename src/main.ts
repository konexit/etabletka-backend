import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const { APP_PORT, APP_HOST, ACCESS_CONTROL_ALLOW_ORIGIN } = process.env;
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ACCESS_CONTROL_ALLOW_ORIGIN,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(APP_PORT, APP_HOST);
}
bootstrap();

// TODO: Do not remove this code. I use it for docker
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, { cors: true });
//   app.useGlobalPipes(new ValidationPipe());
//
//   const configService = app.get(ConfigService);
//   const port = configService.get<number>('APP_PORT');
//
//   await app.listen(port);
// }
// bootstrap();
